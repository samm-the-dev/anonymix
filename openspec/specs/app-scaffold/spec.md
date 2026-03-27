## ADDED Requirements

### Requirement: Vite + React + Supabase project initialization
The project SHALL be a Vite 7 + React 19 + TypeScript application with Supabase as the backend. The `src/` directory SHALL contain all client-side application code. The `supabase/` directory SHALL contain migrations, seed data, config, and advisor ignore list.

#### Scenario: Dev server starts successfully
- **WHEN** the developer runs `npm run dev`
- **THEN** the Vite dev server SHALL start and the app SHALL be accessible in the browser

#### Scenario: TypeScript compilation
- **WHEN** the developer runs `npm run build`
- **THEN** the project SHALL compile with zero TypeScript errors

### Requirement: Path alias configuration
The project SHALL configure the `@/` path alias to resolve to `./src/` in both Vite and TypeScript configs.

#### Scenario: Import resolution
- **WHEN** a component imports from `@/lib/utils`
- **THEN** the import SHALL resolve to `./src/lib/utils` at both compile time and runtime

### Requirement: Tailwind CSS 4 with CSS variable theming
The project SHALL use Tailwind CSS 4 with a CSS variable-based theming system. Light theme SHALL be the default. CSS variables SHALL be defined on `:root` (light) and `.dark` (dark mode).

#### Scenario: Light theme renders by default
- **WHEN** the app loads without a stored theme preference
- **THEN** the light theme CSS variables SHALL be active

#### Scenario: Dark mode toggle
- **WHEN** the user toggles the theme
- **THEN** the `.dark` class SHALL be applied to the `<html>` element and dark theme CSS variables SHALL take effect

#### Scenario: Theme persistence
- **WHEN** the user sets a theme preference and reloads the app
- **THEN** the previously selected theme SHALL be restored from localStorage

### Requirement: Typography
The app SHALL use Quicksand as the display font (headings, app title) and Nunito Sans as the body font (all other text). Fonts SHALL be loaded via Google Fonts.

#### Scenario: Font rendering
- **WHEN** the app loads
- **THEN** the app title and session card titles SHALL render in Quicksand, and body text SHALL render in Nunito Sans

### Requirement: App shell with routing
The app SHALL render a Layout shell with a header (CassetteTape icon + "Anonymix" title, theme toggle), a React Router outlet for page content, and a fixed bottom navigation bar (Sessions + Profile). Auth-gated routing SHALL redirect unauthenticated users to the login page. Public routes (`/privacy`, `/terms`) SHALL be accessible without auth.

#### Scenario: Root route renders Session Home
- **WHEN** an authenticated user navigates to `/`
- **THEN** the Session Home page SHALL render within the app shell

#### Scenario: Unknown routes redirect
- **WHEN** the user navigates to an undefined route
- **THEN** the app SHALL redirect to `/`

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

### Requirement: Testing infrastructure
The project SHALL configure Vitest for unit testing with jsdom environment and @testing-library/react. Playwright SHALL be configured for e2e testing.

#### Scenario: Unit tests run
- **WHEN** the developer runs `npm run test`
- **THEN** Vitest SHALL execute all `*.test.ts` and `*.test.tsx` files in `src/`

#### Scenario: E2e tests run
- **WHEN** the developer runs `npm run test:e2e`
- **THEN** Playwright SHALL execute tests against the running dev server

### Requirement: Code quality tooling
The project SHALL configure ESLint (with TypeScript and React plugins) and Prettier (with Tailwind class sorting).

#### Scenario: Lint check
- **WHEN** the developer runs `npm run lint`
- **THEN** ESLint SHALL check all TypeScript/TSX files with zero errors on a clean codebase
