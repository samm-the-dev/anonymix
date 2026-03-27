## 1. Project Initialization

- [x] 1.1 Initialize Vite + React 19 + TypeScript project in `src/`, install core dependencies (react, react-dom, react-router-dom, typescript), configure `@/` path alias in vite.config.ts and tsconfig — [app-scaffold: Vite + React + Convex project initialization, Path alias configuration]
- [x] 1.2 Install and configure Tailwind CSS 4 with `@tailwindcss/vite` plugin, create `src/index.css` with CSS variable theme (light `:root` / dark `.dark`), configure Quicksand + Nunito Sans fonts via Google Fonts — [app-scaffold: Tailwind CSS 4 with CSS variable theming, Typography]
- [x] 1.3 Install and configure Convex (`npx convex init`), set up `convex/` directory, configure `npm run dev` to start both Vite and Convex dev servers — [app-scaffold: Vite + React + Convex project initialization]
  > NOTE: `npx convex init` must be run interactively by the user to create the cloud project. Convex package installed, `convex/` directory created, scripts configured.
- [x] 1.4 Install and configure ESLint (TypeScript + React plugins), Prettier (with Tailwind class sorting), Vitest (jsdom environment, @testing-library/react), verify `npm run lint` and `npm run test` work — [app-scaffold: Code quality tooling, Testing infrastructure]

## 2. App Shell & Routing

- [x] 2.1 Create `src/App.tsx` with React Router routes: `/` → SessionHomePage, `/session/:sessionId` → stub, catch-all → redirect to `/`. Create `src/main.tsx` entry point with BrowserRouter and ConvexProvider — [app-scaffold: App shell with routing]
- [x] 2.2 Create `src/components/Layout.tsx` app shell with header ("Anonymix" centered title, Quicksand font), theme toggle button, and `<Outlet />` for page content — [app-scaffold: App shell with routing, Typography]
- [x] 2.3 Port `useTheme` hook from react-vite-starter reference, create `src/lib/utils.ts` with `cn()` utility (clsx + tailwind-merge) — [app-scaffold: Tailwind CSS 4 with CSS variable theming]

## 3. Convex Schema & Queries

- [x] 3.1 Define Convex schema in `convex/schema.ts`: sessions table (name, description, adminId, playerIds, ended), tapes table (sessionId, title, prompt, status union, deadline, completedAt), players table (name, avatar, avatarColor) — [session-data-model: Session/Tape/Player document schema]
- [x] 3.2 Create `convex/sessions.ts` query function: list sessions for current user (filtered by playerIds membership), join active tape per session, sort by deadline urgency, include user action state (submitted/commented) — [session-data-model: Query — list sessions for current user, Query — user action state per tape]
- [x] 3.3 Create `convex/seed.ts` seed script populating demo data: 2+ sessions, 6 tape status variants (submitting done/not-done, commenting done/not-done, playlist_ready, results), 5+ players with emoji avatars — [session-data-model: Dev seed data]

## 4. Session Home Components

- [x] 4.1 Create `src/components/StatusBadge.tsx` — status badge with CVA variants for 4 tape states (green/amber/blue/purple), uppercase label — [session-home-page: Status badge with color coding]
- [x] 4.2 Create `src/components/AvatarRow.tsx` — overlapping circular avatars with emoji characters on colored backgrounds, negative margin overlap — [session-home-page: Avatar row]
- [x] 4.3 Create `src/components/SessionCard.tsx` — full card layout: title + menu icon, description, AvatarRow, tape title/prompt (active only), action row with View button + StatusBadge + deadline + action button. Action button states driven by tape status and user action state — [session-home-page: Session card layout, Action button states, Deadline display]
- [x] 4.4 Create deadline formatting utility in `src/lib/formatDeadline.ts` — relative deadline display ("due today", "due tomorrow", "due in N days", "due (overdue)", "N days ago", "~N months ago") — [session-home-page: Deadline display]

## 5. Session Home Page

- [x] 5.1 Create `src/pages/SessionHomePage.tsx` — consumes Convex `useQuery` for session list, splits into active/completed, renders collapsible sections with chevron toggle and count, section animation — [session-home-page: Collapsible sections]
- [x] 5.2 Wire View button navigation to `/session/:sessionId` stub route — [session-home-page: View button navigation]
- [x] 5.3 Responsive layout — vertical card stack on mobile, grid on wider viewports — [session-home-page: Responsive layout]

## 6. Testing & Verification

- [x] 6.1 Unit tests: formatDeadline utility, StatusBadge variant rendering, SessionCard renders all status states correctly
- [x] 6.2 Integration test: SessionHomePage renders seeded data from Convex, sections expand/collapse, View button navigates
- [x] 6.3 Visual check: compare rendered Session Home against prototype across all 6 status variants, verify fonts, colors, spacing
