## Why

Anonymix has validated prototypes and UX specs but no production codebase. Session Home is the app's entry point — the first page a user sees on a cold open — and building it forces every foundational decision: app shell, routing, data model, component patterns, and dev tooling. Standing this up as the first change creates the scaffold that all subsequent features build on.

Reference: [01.1-session-home spec](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.1-session-home/01.1-session-home.md), [session-home prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/session-home.html)

## What Changes

- **New:** Vite + React 19 + TypeScript project in `src/` with Tailwind CSS 4, React Router 7, and Convex backend
- **New:** Convex schema defining Session, Tape, and Player document types with the tape state machine (submitting → commenting → playlist_ready → results)
- **New:** Convex query functions for fetching user sessions with current tape status
- **New:** Session Home page — session cards in a vertical stack (mobile) / grid (desktop) with status badges, avatar rows, action buttons, and deadline countdowns
- **New:** App shell with header, routing structure, and theming (Quicksand + Nunito Sans fonts, CSS variable light/dark theme)
- **New:** Convex dev seed data matching the prototype's demo scenarios (6 status variants across active/completed sessions)
- **New:** Dev tooling baseline — Vitest config, ESLint, Prettier, path aliases

## Non-goals

- **Auth** — no login flow, no Convex Auth setup. Session Home renders for a hardcoded dev user. Auth is a separate change.
- **Platform integration** — no Spotify/YouTube Music OAuth or playlist generation.
- **Other pages** — no Tape List, Tape Submission, or any page beyond Session Home. Routing shell exists but routes are stubs.
- **Real-time subscriptions** — Convex queries are reactive by default, but we're not building the server-side game logic that mutates tape state. Data is seeded, not live.
- **Push notifications** — the primary Enthusiast path (notification → deep link) is out of scope.

## Capabilities

### New Capabilities

- `app-scaffold`: Vite + React + Convex project setup, app shell, routing structure, theming, dev tooling
- `session-data-model`: Convex schema for sessions, tapes, and players; query functions; dev seed data
- `session-home-page`: Session Home UI — session cards with status variants, avatar rows, action buttons, responsive layout

### Modified Capabilities

(none — greenfield project)

## Impact

- **New dependencies:** react, react-dom, react-router-dom, convex, tailwindcss, lucide-react, sonner, class-variance-authority, clsx, tailwind-merge, vitest, @testing-library/react
- **New project structure:** `src/` (app code), `convex/` (backend schema + functions)
- **Dev workflow:** `npm run dev` starts both Vite dev server and Convex dev backend
