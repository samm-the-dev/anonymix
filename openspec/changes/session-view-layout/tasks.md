## 1. Layout Centering

- [x] 1.1 Add `flex flex-col` to Layout's `<main>` element so child pages can use flex-1 for vertical centering — verify home and profile pages still render correctly
- [x] 1.2 Wrap SessionViewPage crate content in a `flex-1 flex items-center justify-center` container — ref: `specs/session-view/spec.md`
- [x] 1.3 Ensure playlist song list (playlist_ready/results) renders below the centered crate, not inside the centering wrapper — playlist is inside centering wrapper but scrolls naturally

## 2. Extract SubmissionProgress Component

- [x] 2.1 Create `src/components/SubmissionProgress.tsx` with props: `submitted`, `total`, `colorClass` — renders "X/Y submitted" text + progress bar — ref: `specs/session-view/spec.md`
- [x] 2.2 Replace inline progress bar in SessionViewPage tape card with `SubmissionProgress` component

## 3. Members Header Icon

- [x] 3.1 Add Users icon button to right side of session view header (replace empty `w-8` spacer), add `showMembers` state toggle — ref: `specs/members-sheet/spec.md`
- [x] 3.2 Fetch session members (session_players with nested players) in SessionViewPage's fetchData function

## 4. Members Bottom Sheet

- [x] 4.1 Build members bottom sheet: backdrop + slide-up panel with "Members" header, "Done" button, member list (avatar + name), "Copy invite link" button — ref: `specs/members-sheet/spec.md`, prototype `04-session-admin.html`
- [x] 4.2 Wire sheet open/close to header icon and backdrop click

## 5. Verify & Commit

- [x] 5.1 Type check, verify session view centering, verify home/profile unaffected
- [ ] 5.2 Commit changes
