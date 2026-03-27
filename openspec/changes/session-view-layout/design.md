## Context

The session view renders inside Layout's `<main className="flex-1 pb-16"><Outlet /></main>`. The `pb-16` reserves space for the fixed bottom nav. Previous centering attempts used `h-screen` and `overflow-hidden` on the page itself, which conflicted with Layout's structure and hid the bottom nav.

The prototype achieves centering with `<main class="flex-1 flex items-center justify-center p-4">` — centering is on the main container, not the page.

## Goals / Non-Goals

**Goals:**
- Center tape crate vertically within Layout's main area (between app header and bottom nav)
- Add members icon button to session view header without breaking centered title
- Add bottom sheet for viewing members with invite link copy
- Extract `SubmissionProgress` as a reusable component

**Non-Goals:**
- Changing Layout component's structure for other pages
- Host admin features in the members sheet (no remove/kick)
- Playlist view scrolling behavior changes

## Decisions

### 1. Centering approach: page-level flex, not Layout change

**Decision**: The session view page wraps its crate content in a `flex-1 flex items-center justify-center` container. Layout's `<main>` gets `flex flex-col` added so `flex-1` on the child works. This is minimal — Layout already has `flex-1`, it just needs to pass flex context down.

**Alternative considered**: Make Layout's `<main>` always center content. Rejected — other pages (home, profile) don't want centering.

**Alternative considered**: Use `min-h-[calc(100vh-header-nav)]` with `items-center`. Rejected — fragile magic numbers.

### 2. Members sheet: inline state, not a route

**Decision**: The members sheet is a slide-up overlay controlled by local state in SessionViewPage, not a separate route. Matches the prototype pattern (session-admin.html uses `openSheet('members')`).

**Why**: It's a quick-glance panel, not a destination. No URL needed.

### 3. Header icon: Users lucide icon

**Decision**: Use lucide `Users` icon button on the right side of the header, same `w-8` as the back button on the left, keeping the title centered via absolute positioning.

### 4. Members data: fetch alongside session data

**Decision**: Expand the existing `fetchData` function to also fetch `session_players` with nested `players(*)` for the current session. No new hook — just extend what's there.

## Risks / Trade-offs

- **Layout `<main>` flex change** → Adding `flex flex-col` to Layout's main could theoretically affect other pages. Mitigation: test home and profile pages still look correct.
- **Bottom sheet z-index** → Must be above the bottom nav (z-50 should work, nav has no explicit z-index).
