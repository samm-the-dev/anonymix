## Why

A production bug allowed a player who joined a session *after* a tape's submission phase closed to insert a submission into that tape. The submissions RLS policy only checks `player_id = current_player_id()` — it does not verify the tape is in `submitting` status or that the player is a session member. Additionally, the frontend derives the active tape from an array index that can go stale after data re-fetches, risking submissions against the wrong tape.

## What Changes

- **Tighten the `insert submissions` RLS policy** to require:
  - The target tape is in `submitting` status
  - The player is a member of that tape's session
- **Tighten the `update own submissions` RLS policy** to also require tape `submitting` status (prevent edits after submission closes)
- **Add a frontend guard** in `handleSubmit` to re-validate tape status before inserting, with a user-facing error if the tape is no longer accepting submissions
- **Use tape ID instead of array index** for active tape tracking to eliminate stale-reference bugs

## Non-goals

- Adding a `joined_at` timestamp to `session_players` — the RLS tape-status check is sufficient to prevent late submissions regardless of when the player joined
- Changing the `advance_next_tape` trigger logic — the dual-submitting fix from the prior PR is working correctly
- Retroactively fixing existing prod data — that will be handled manually via SQL

## Capabilities

### New Capabilities

_None — this is a hardening fix, not a new feature._

### Modified Capabilities

- `song-submission`: Adding server-side validation requirements (RLS must enforce tape status = 'submitting' and session membership on insert/update)

## Impact

- **Database**: Migration to replace two RLS policies on `submissions` table
- **Frontend**: [SessionViewPage.tsx](src/pages/SessionViewPage.tsx) — submission handler and active tape tracking
- **No API/dependency changes**
