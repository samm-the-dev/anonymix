## 1. Schema

- [x] 1.1 Create migration: add `submission_id` (uuid, nullable, FK to submissions, cascade delete) to comments table
- [x] 1.2 Update `database.types.ts` with new comments column
- [x] 1.3 Push migration

## 2. Listen & Comment Page

- [x] 2.1 Create `src/pages/ListenCommentPage.tsx` with header (back + session name), tape info section, expandable TMM instructions, song list with comment fields, "The Tape" comment, and submit button — ref: prototype tape-voting.html
- [x] 2.2 Fetch tape submissions (excluding current user's own), session info, and existing comments
- [x] 2.3 Build expandable TMM instructions section: platform dropdown + copy & open button + step-by-step text. Track expanded/collapsed state in localStorage.
- [x] 2.4 Build per-song comment fields: album art thumbnail + song name + artist + textarea
- [x] 2.5 Build "The Tape" overall comment field
- [x] 2.6 Build submit handler: bulk insert non-empty comments with tape_id, player_id, submission_id (or null for tape-level), navigate back to session view on success
- [x] 2.7 Add no-pressure framing text matching prototype tone

## 3. Route & Navigation

- [x] 3.1 Add route `/session/:sessionId/tape/:tapeId/comment` in App.tsx (outside Layout, like create/join)
- [x] 3.2 Update SessionViewPage: simplify playlist_ready card — remove song list and TMM controls, show comment progress + "Listen & Comment" button that navigates to comment page
- [x] 3.3 Update SessionCard action button: playlist_ready navigates to comment page. Update label to "Listen & Comment".

## 4. Verify & Commit

- [x] 4.1 Type check, test comment page render, test comment submission
- [ ] 4.2 Commit all changes
