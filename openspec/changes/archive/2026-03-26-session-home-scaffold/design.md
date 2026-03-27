## Context

Anonymix is a greenfield React app. The validated HTML prototypes in `_bmad-output/D-Prototypes/` prove the UI; this change ports them to a production stack. The react-vite-starter at `c:\Dev\react-vite-starter` provides reference patterns (cn utility, useTheme hook, Tailwind CSS variable theming, Vitest config) but we're building fresh — not copying the template.

Backend is Supabase — chosen for Postgres portability, first-class Spotify + Google auth, self-hosting option, and real-time subscriptions. This replaces the originally planned Firebase stack (Convex was considered but rejected due to vendor lock-in concerns — not self-hostable).

## Goals / Non-Goals

**Goals:**
- Production project structure that all future changes build on
- Supabase Postgres schema that models the core domain (sessions, tapes, players)
- Session Home page faithful to the UX spec and validated prototype
- Dev seed data for all tape status variants
- Testable from day one (Vitest + Playwright wired up)

**Non-Goals:**
- Auth (hardcoded dev user)
- Game logic mutations (tape state advances, score calculation)
- Any page beyond Session Home (routing stubs only)
- Deployment / CI pipeline

## Decisions

### 1. Supabase as backend (replaces Firebase)

**Choice:** Supabase Cloud free tier for database, auth, real-time, and edge functions.

**Why over Firebase:** Standard Postgres (portable, self-hostable), both Google and Spotify OAuth are first-class social logins, SQL is a transferable skill, row-level security via Postgres policies instead of a proprietary DSL.

**Why over Convex:** Convex offered better TypeScript DX (auto-reactive queries, zero-glue types) but is not self-hostable — managed service only. Vendor lock-in risk was the deciding factor. Supabase is fully open-source and the data is a standard Postgres database that can be moved anywhere.

**Alternatives rejected:** Firebase (unfamiliar, proprietary query model), Convex (managed-only, vendor lock-in).

### 2. Project structure

**Choice:**
```
src/
  components/     # Shared components (SessionCard, AvatarRow, StatusBadge)
  hooks/          # Custom hooks (useTheme)
  lib/            # Utilities (cn, formatDeadline), Supabase client, types
  pages/          # Route-level components (SessionHomePage)
  App.tsx         # Route definitions
  main.tsx        # Entry point
  index.css       # Tailwind imports + CSS variable theme
supabase/
  schema.sql      # Postgres DDL
  seed.sql        # Dev seed data
```

**Why:** Matches the react-vite-starter conventions (PascalCase components, colocated tests, `@/` path alias). `supabase/` holds SQL files for the database schema and seed data.

### 3. Tape state machine

**Choice:** Tape status as a Postgres enum: `tape_status` with values `submitting | commenting | playlist_ready | results`

```
submitting ──▶ commenting ──▶ playlist_ready ──▶ results
```

**Why:** Matches the prototype's STATUS_CONFIG and the UX spec's four color-coded states (green, amber, blue, purple). Postgres enum provides type safety at the database level. Transitions are server-side (future change) — this change only models the states.

### 4. Session card as a single component with status-driven variants

**Choice:** One `SessionCard` component using class-variance-authority for status-dependent styling (badge colors, button states, deadline formatting).

**Why:** The prototype already proved this pattern — `STATUS_CONFIG` maps each status to badge classes, button classes, and label text. CVA formalizes this as typed variants rather than a runtime config object.

### 5. Theming approach

**Choice:** CSS variables on `:root` / `.dark`, toggled via `useTheme` hook. Light theme default (spec: "own visual identity, not OHM's dark-first aesthetic"). Quicksand for display text, Nunito Sans for body.

**Why:** Same pattern as react-vite-starter, proven to work with Tailwind CSS 4's `@theme inline` directive.

### 6. Dev seed data via SQL + mock data fallback

**Choice:** SQL seed script in `supabase/seed.sql` for seeding the Supabase database, plus a TypeScript mock data module (`src/lib/mockData.ts`) for immediate local development without Supabase connection.

**Why:** The mock data layer lets the UI render immediately (`npm run dev`) without any backend setup. Once Supabase is connected, the same data shapes are populated via the SQL seed script. This two-layer approach avoids blocking UI development on backend configuration.

### 7. Auth deferral — mock data with hardcoded user state

**Choice:** Mock data includes `userActionDone` boolean per session, simulating whether the current user has completed the action. No auth provider, no login page.

**Why:** Auth is a separate concern with its own complexity (Supabase Auth + Google + Spotify). Session Home needs user action state to determine button labels (Submit vs Change, Comment vs Commented) but doesn't need real auth to validate the UI.

## Risks / Trade-offs

- **[Supabase connection dependency]** → UI development is blocked on Supabase project setup if no mock data layer exists. → Mitigated by mock data module that lets the app render immediately without any backend. Supabase connection is additive, not blocking.

- **[Schema evolution]** → The Postgres schema defined here will evolve as auth, voting, and playlist features land. → Postgres migrations are a well-understood pattern. Keep the initial schema minimal — only tables Session Home actually reads.

- **[Prototype fidelity gap]** → The HTML prototype uses Tailwind CDN classes; production uses Tailwind CSS 4 with a different config syntax. → Visual regression risk is low since the prototype was validated at the interaction level, not pixel-perfect. Playwright visual tests can catch drift.

- **[Session membership as join table]** → Using `session_players` join table instead of an array field. More normalized than the prototype's data model but standard Postgres pattern. Queries need a join but it's cleaner for adding roles/permissions later.

## Open Questions

- **Supabase project setup:** Create project on supabase.com, run schema.sql and seed.sql in SQL Editor. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars.
- **Avatar implementation:** Prototype uses emoji avatars with colored backgrounds. Production may want profile images (from OAuth providers) eventually. Start with the emoji pattern, design the component to accept either.
- **Type generation:** Currently using manually-defined types. Once Supabase is connected, switch to `npx supabase gen types typescript` for auto-generated types.
