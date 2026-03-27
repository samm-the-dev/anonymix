## ADDED Requirements

### Requirement: Vite + React + Convex project initialization
The project SHALL initialize a Vite + React 19 + TypeScript application with Convex as the backend. The `src/` directory SHALL contain all client-side application code. The `convex/` directory SHALL contain all Convex backend code (schema, functions, seed data).

#### Scenario: Dev server starts successfully
- **WHEN** the developer runs `npm run dev`
- **THEN** both the Vite dev server and Convex dev backend SHALL start, and the app SHALL be accessible in the browser

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
The app SHALL render a shell with a header containing the app title ("Anonymix") and a React Router outlet for page content. Routes SHALL be defined for Session Home (`/`) and stub routes for future pages.

#### Scenario: Root route renders Session Home
- **WHEN** the user navigates to `/`
- **THEN** the Session Home page SHALL render within the app shell

#### Scenario: Unknown routes
- **WHEN** the user navigates to an undefined route
- **THEN** the app SHALL render a fallback (404 or redirect to `/`)

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
