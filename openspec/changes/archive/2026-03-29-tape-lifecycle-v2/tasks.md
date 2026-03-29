## 1. Schema & Migrations

- [x] 1.1 Migration: add `upcoming` to `tape_status` enum
- [x] 1.2 Migration: add `comment_window_hours` column to tapes (integer, not null, default 120)
- [x] 1.3 Migration: create trigger `advance_next_tape` — when a tape reaches `results` or `skipped`, advance next `upcoming` tape (by `created_at`) to `submitting`
- [x] 1.4 Migration: create trigger `set_playlist_ready_deadline` — when tape transitions to `playlist_ready`, set `deadline = now() + comment_window_hours`
- [x] 1.5 Migration: update cron job to also advance expired `playlist_ready` tapes to `results`
- [x] 1.6 Update `database.types.ts` and `src/lib/types.ts` with `upcoming` status and `comment_window_hours`
- [x] 1.7 Push migrations

## 2. Session Creation

- [x] 2.1 Update CreateSessionPage: first tape inserts as `submitting`, rest as `upcoming`
- [x] 2.2 Update CreateSessionPage: wire `commentDays` to `comment_window_hours` on tape inserts

## 3. UI Updates

- [x] 3.1 Update StatusBadge: add `upcoming` variant (gray/muted style, label "Upcoming")
- [x] 3.2 Update SessionCard: add `upcoming` to action button variants (no-action style)
- [x] 3.3 Update SessionViewPage: upcoming tape card shows prompt + "Upcoming" badge, no action buttons
- [x] 3.4 Update SessionViewPage: show comment deadline on playlist_ready cards (reuse existing deadline display pattern)
- [x] 3.5 Update TapePage routing: `submitting`/`upcoming` → redirect to session view, `skipped` → simple display, `playlist_ready` → ListenCommentPage, `results` → ResultsPage
- [x] 3.6 Update formatDeadline to handle `upcoming` status (return empty string)
- [x] 3.7 Update useSessionList `pickActiveTape` to not treat `upcoming` as actionable — already correct

## 4. Verify & Commit

- [x] 4.1 Type check, run tests, fix any failures
- [ ] 4.2 Commit all changes
