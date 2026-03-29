## 1. Schema Migration

- [x] 1.1 Create migration: add `submit_window_hours` (integer, not null, default 48) to tapes table
- [x] 1.2 Create migration: add Postgres trigger on submissions INSERT that sets tape deadline on first submission
- [x] 1.3 Create migration: enable pg_cron and schedule `advance-expired-tapes` job (every 30 min)
- [x] 1.4 Update `database.types.ts` with new tapes column
- [x] 1.5 Push migrations

## 2. Create Session — Null Deadline + Window Hours

- [x] 2.1 Update CreateSessionPage to pass `submit_window_hours` (submitDays * 24) when creating tapes, with `deadline: null`
- [x] 2.2 Verify existing tape creation code doesn't hardcode a deadline

## 3. Session View — Host Controls

- [x] 3.1 Fetch session admin_id in SessionViewPage to determine if current user is host
- [x] 3.2 Add "Close submissions" button visible only to host when tape is in `submitting` status — updates tape status to `playlist_ready`

## 4. Session View — Deadline Display

- [x] 4.1 Update tape card to show "Waiting for first submission" when deadline is null
- [x] 4.2 Show "Submissions closing..." and disable submit when deadline is past but status still `submitting`

## 5. Verify & Commit

- [x] 5.1 Type check, test first-submission trigger, test host close, verify cron job exists
- [x] 5.2 Commit all changes
