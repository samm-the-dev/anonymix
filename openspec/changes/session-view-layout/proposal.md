## Why

The session view tape crate needs to be vertically centered in the viewport (matching the prototype) and the header needs a members button. Previous centering attempts caused layout issues because they fought with the Layout component's structure. The prototype achieves centering with `flex-1 flex items-center justify-center` on the main content area — we need to do the same within the Outlet context.

Reference: [session-view.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/session-view.html) — `<main class="flex-1 flex items-center justify-center p-4">`, [session-admin.html prototype](_bmad-output/D-Prototypes/04-the-hosts-session-edits-prototype/session-admin.html) — members bottom sheet pattern.

## Non-goals

- Host admin features (session settings edit, tape reordering) — separate change
- Removing/replacing the bottom nav on session view
- Changing the tape card content or state-specific rendering

## What Changes

- **Vertical centering**: Center the tape crate (spines + card) vertically within the available viewport space (between session header and bottom nav), without adding unwanted internal spacing
- **Members icon button**: Add a Users icon button to the right of the session header title (balanced with back button on left, title stays centered via absolute positioning)
- **Members bottom sheet**: Slide-up sheet showing session members with avatars/names and a "Copy invite link" button at the bottom
- **Extract SubmissionProgress component**: Reusable progress bar with "X/Y submitted" text, used inside the tape card

## Capabilities

### New Capabilities
- `members-sheet`: Bottom sheet showing session members with avatars, names, and invite link copy

### Modified Capabilities
- `session-view`: Adding vertical centering of tape crate, members icon in header, and extracting progress bar component

## Impact

- **Files**: `SessionViewPage.tsx` (layout + header + sheet), new `SubmissionProgress.tsx` component
- **Data**: Need to fetch session members (players) in session view — currently only fetches tapes and submissions
- **Layout interaction**: Must work within Layout's `<main className="flex-1 pb-16">` without breaking the bottom nav
