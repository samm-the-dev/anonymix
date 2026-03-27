# Story: Session View — Section 1: Session Header + Crate Shell

**Status:** Complete
**Completed:** 2026-03-25
**Summary:** Header with absolute-centered title, back nav, host-only gear icon. Crate container centered in viewport. URL param session selection.

## Purpose
Create the session header with back navigation, session name, and host gear icon. Set up the crate container that will hold the tape stack.

## Specifications Reference
- `01.2-tape-list.md` — Tape List page spec
- `Session-View-Work.yaml` — Section 1 definition
- `Sketches/session-view-wireframe.png` — Approved wireframe

## Objects

### session-header
- **Type:** Navigation bar
- **Layout:** ← back (left) | session name (center) | gear icon (right, host only)
- **Behavior:** Back navigates to session-home.html. Gear icon only visible when current user is session admin.
- **States:** Host view (gear visible), non-host view (gear hidden)

### tape-crate
- **Type:** Container
- **Behavior:** Vertically centered on screen below header, holds tape card stack
- **States:** Default only (content added in later sections)

## HTML Structure

```
<header>
  <button class="back">←</button>
  <h1>Session Name</h1>
  <button class="gear">⚙</button>   <!-- host only -->
</header>
<main>
  <div class="tape-crate">
    <!-- tape spines and active card go here -->
  </div>
</main>
```

## Tailwind Classes

- **Header:** `px-4 py-3 border-b border-gray-200 flex items-center justify-between`
- **Back button:** `text-gray-600 text-sm font-medium w-8`
- **Session name:** `text-lg font-semibold text-center flex-1`
- **Gear icon:** `w-8 text-gray-400` (hidden if not host)
- **Main:** `flex-1 flex items-center justify-center p-4`
- **Crate container:** `w-full max-w-[375px] relative` (will hold the stacked cards)

## JavaScript Requirements

### Functions
- `loadSessionData()` — fetch demo-data.json, extract session by URL param or default to Comic Book Fuckery
- `renderHeader(session, currentUser)` — render session name and conditionally show gear icon
- `isHost(session, userId)` — returns true if user is admin

### URL Parameters
- `?session=comic-book-fuckery` — selects which session to display
- Default to first active session if no param

## Demo Data
- Session: Comic Book Fuckery (Sam is admin → gear visible)
- Placeholder text in crate area: "Tape crate will appear here"

## Acceptance Criteria

### Agent-Verifiable
- [ ] Header shows back arrow, "Comic Book Fuckery", and gear icon
- [ ] Gear icon visible (Sam is admin of CBF)
- [ ] Back button links to session-home.html
- [ ] Crate container centered below header
- [ ] No horizontal overflow at 375px

### User-Evaluable
- [ ] Header feels balanced with three-column layout
- [ ] Back arrow is tappable at mobile size
- [ ] Gear icon is subtle but visible
