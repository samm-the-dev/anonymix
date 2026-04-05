## 1. Database — RLS policy migration

- [x] 1.1 Create migration that drops and recreates `insert submissions` policy to require `tapes.status = 'submitting'` and `is_session_member()` (spec: Submit song — RLS enforcement)
- [x] 1.2 In the same migration, drop and recreate `update own submissions` policy to add `tapes.status = 'submitting'` check (spec: Change existing submission — tape status guard)

## 2. Frontend — stable tape reference and error handling

- [x] 2.1 Capture `activeTape.id` when the search overlay opens (ref or local state) so `handleSubmit` uses the captured value, not the live index-derived `activeTape` (design: decision 2)
- [x] 2.2 Add error handling in `handleSubmit` catch block to show "This tape is no longer accepting submissions" toast on insert/update failure and call `fetchData()` to refresh (spec: Submission rejected — tape no longer accepting)

## 3. Verify

- [x] 3.1 Test locally: submit to a `submitting` tape succeeds; manually set tape to `playlist_ready` and verify insert is rejected by RLS
- [x] 3.2 Open draft PR to create Supabase preview branch, run `npm run env:local`, verify against preview DB
