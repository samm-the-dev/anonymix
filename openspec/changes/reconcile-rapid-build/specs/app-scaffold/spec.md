## MODIFIED Requirements

### Requirement: Vite + React + Supabase project initialization
The project SHALL be a Vite 7 + React 19 + TypeScript application with Supabase as the backend. The `src/` directory SHALL contain all client-side application code. The `supabase/` directory SHALL contain migrations, seed data, config, and advisor ignore list.

#### Scenario: Dev server starts successfully
- **WHEN** the developer runs `npm run dev`
- **THEN** the Vite dev server SHALL start and the app SHALL be accessible in the browser

#### Scenario: TypeScript compilation
- **WHEN** the developer runs `npm run build`
- **THEN** the project SHALL compile with zero TypeScript errors

### Requirement: Supabase CLI integration
The project SHALL include `supabase` as a dev dependency with npm scripts: `db:push` (push migrations), `db:advisors` (run advisor checks with filtering), `db:gen-types` (regenerate TypeScript types from remote schema).

#### Scenario: Push migrations
- **WHEN** the developer runs `npm run db:push`
- **THEN** pending migrations SHALL be applied to the linked Supabase project

### Requirement: Advisor check with ignore list
The `db:advisors` script SHALL run Supabase advisors and filter out warnings listed in `supabase/advisor-ignore` (by cache_key). Non-ignored warnings SHALL cause a non-zero exit code.

#### Scenario: Ignored warning filtered
- **WHEN** `auth_leaked_password_protection` is in the ignore list
- **THEN** the advisor script SHALL not report it

### Requirement: Post-push advisor reminder hook
A Claude Code PostToolUse hook SHALL fire after any Bash command containing `db:push` or `db push`, injecting a reminder to run `npm run db:advisors`.

#### Scenario: Hook fires after push
- **WHEN** a migration is pushed via `npx supabase db push`
- **THEN** the hook SHALL inject a context reminder about running advisors

### Requirement: Icon and OG banner generation
The project SHALL include `gen:icons` (renders `public/favicon.svg` to ICO, 192px, 512px, and maskable PNG via Playwright) and `gen:og` (renders `public/og-banner.html` to 1200x630 PNG).

#### Scenario: Generate icons
- **WHEN** the developer runs `npm run gen:icons`
- **THEN** favicon.ico, icon-192.png, icon-512.png, and icon-512-maskable.png SHALL be generated

## REMOVED Requirements

### Requirement: Convex backend initialization
**Reason**: Backend pivoted from Convex to Supabase.
**Migration**: Replace `convex/` directory with `supabase/` directory. Use Supabase CLI for schema management. Client uses `@supabase/supabase-js` instead of Convex client.
