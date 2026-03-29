## 1. Schema & Migrations

- [x] 1.1 Migration: add `completed_at timestamptz` column to sessions
- [x] 1.2 Migration: create trigger `check_session_complete` — on tape status update, if all tapes in session are terminal, set `ended = true` and `completed_at = now()`
- [x] 1.3 Update `database.types.ts` with `completed_at` on sessions
- [x] 1.4 Push migration

## 2. Session Summary

- [x] 2.1 Compute summary stats in SessionViewPage: tapes completed, total songs, total comments, most-commented song(s), most active commenter(s)
- [x] 2.2 Build collapsible summary component shown above tape crate when `ended = true`
- [x] 2.3 Display most-commented songs with album art, title, comment count (handle ties)
- [x] 2.4 Display most active commenters with avatar, name, comment count (handle ties)

## 3. Session View Updates

- [x] 3.1 Hide host menu (dots) and action buttons (submit, listen & comment) when session is ended — keep "View Comments" for results tapes — already handled by status-gated rendering
- [x] 3.2 Pass `ended` flag through TapePage to ListenCommentPage
- [x] 3.3 ListenCommentPage: default to "Import playlist" tab when `ended = true`
- [x] 3.4 Hide "Share comments" button when session is ended

## 4. Verify & Commit

- [x] 4.1 Type check, run tests
- [ ] 4.2 Commit all changes
