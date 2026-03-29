# Layout Consistency — Update Specification

## Change Summary
Extract a shared `AppBar` component and create a `TaskLayout` wrapper for focused task pages. This eliminates duplicated header logic from CreateSessionPage, JoinSessionPage, and the custom app bar in ListenCommentPage (which was already removed). All app-shell pages get consistent branding and navigation through two layout tiers.

## Before
- `Layout` provides app bar + bottom nav for Home, Session View, Profile, and Tape pages
- `CreateSessionPage` and `JoinSessionPage` each reimplement their own app bar (back button + theme toggle)
- Tape pages (Listen/Comment, Results) show bottom nav during focused tasks
- Login, ProfileSetup, Privacy, Terms have no shared shell

## After

### AppBar Component (`src/components/AppBar.tsx`)
Shared header used by both Layout and TaskLayout.

**Props:**
- `showBack?: boolean` — show back button in left slot (default: false)

**Structure:**
```
[back? | spacer]   Anonymix 📼   [theme toggle]
```

- Left: `ArrowLeft` button calling `navigate(-1)` when `showBack=true`, otherwise empty `<div className="h-5 w-5" />`
- Center: "Anonymix" + CassetteTape icon (absolute or flex-1 centered)
- Right: theme toggle button
- Border bottom: `border-b border-border`

### Layout (`src/components/Layout.tsx`)
Full chrome for browsing pages.

- Renders `<AppBar />` (back auto-detected from route: hidden on `/` and `/profile`)
- `<main>` with `<Outlet />`
- Fixed bottom nav

**Routes:** Home, Session View, Profile

### TaskLayout (`src/components/TaskLayout.tsx`)
Task chrome for focused flows — no bottom nav.

- Renders `<AppBar showBack />`
- `<main>` with `<Outlet />`
- No bottom nav
- No `pb-16` padding (no nav to clear)

**Routes:** Create, Join, Tape pages (via TapePage)

### Bare pages (no layout wrapper)
- Login, ProfileSetup, Privacy, Terms
- No changes to these pages

### Route Structure (`App.tsx`)
```tsx
<Routes>
  <Route path="create" element={<TaskLayout />}>
    <Route index element={<CreateSessionPage />} />
  </Route>
  <Route path="join/:sessionId" element={<TaskLayout />}>
    <Route index element={<JoinSessionPage />} />
  </Route>
  <Route element={<Layout />}>
    <Route index element={<SessionHomePage />} />
    <Route path=":sessionSlug" element={<SessionViewPage />} />
    <Route path="profile" element={<ProfilePage />} />
  </Route>
  <Route element={<TaskLayout />}>
    <Route path=":sessionSlug/tape/:tapeIndex" element={<TapePage />} />
  </Route>
</Routes>
```

## Components

| Component | Action | Details |
|-----------|--------|---------|
| `AppBar` | **New** | Extracted from Layout. Props: `showBack`. |
| `TaskLayout` | **New** | AppBar(showBack) + Outlet, no bottom nav |
| `Layout` | **Modified** | Use AppBar internally, keep bottom nav |
| `CreateSessionPage` | **Modified** | Remove custom header (lines ~215-235) |
| `JoinSessionPage` | **Modified** | Remove custom header + theme toggle |
| `App.tsx` | **Modified** | Restructure route groups |

## Responsive Behavior
No change — AppBar and layouts are already mobile-first. The back button and theme toggle scale with the existing icon sizes.

## Acceptance Criteria
1. AppBar renders identically on all app-shell pages (same branding, same position, same theme toggle)
2. Back button visible on all task pages (Create, Join, Tape)
3. Back button hidden on Home and Profile
4. Bottom nav visible only on Home, Session View, Profile
5. No bottom nav on Create, Join, or Tape pages
6. Theme toggle accessible from every page except bare pages (Login, Privacy, Terms, ProfileSetup)
7. No duplicate header implementations — CreateSessionPage and JoinSessionPage use TaskLayout's AppBar
