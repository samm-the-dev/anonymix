## Why

Tapes currently have deadlines set at session creation but no mechanism to advance status. There's no way for a tape to transition from `submitting` to `playlist_ready` — the status stays static. We need automatic deadline-driven transitions and host manual controls to complete the core tape round cycle.

Reference: [01.4-tape-playlist-ready](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.4-tape-playlist-ready/01.4-tape-playlist-ready.md), [04-session-admin](_bmad-output/D-Prototypes/04-the-hosts-session-edits-prototype/session-admin.html)

## Non-goals

- Commenting phase (`commenting` status) — separate change
- Reveal phase (`results` status) — separate change
- Push notifications for status changes
- Auto-advancing multiple tapes in sequence (one tape at a time for now)

## What Changes

- **Deadline starts on first submission**: When the first player submits to a tape, the deadline is set to `now + submitDays`. Before first submission, deadline is null (no countdown displayed).
- **Auto-advance on deadline**: A `pg_cron` job runs every 30 minutes in Supabase Postgres, advancing any tape past its deadline from `submitting` → `playlist_ready`. No client-side or Edge Function needed.
- **Host manual close**: Session admin can end submissions early via a "Close submissions" option, which immediately advances the tape to `playlist_ready`.
- **Tape card reflects state**: The session view tape card already handles `playlist_ready` state (copy playlist button, song list). This change wires up the transitions so that state is actually reached.

## Capabilities

### New Capabilities
- `tape-auto-advance`: pg_cron job for deadline-based status advancement
- `tape-host-controls`: Host can manually close submissions on active tapes

### Modified Capabilities
- `session-view`: Tape card in submitting state shows "no deadline yet" when deadline is null (pre-first-submission). Host sees "Close submissions" option.
- `create-session`: Tapes are created with null deadline (timer starts on first submission, not session creation)

## Impact

- **Modified files**: `SessionViewPage.tsx` (deadline check, host controls), `CreateSessionPage.tsx` (null deadline on create), `useSessionList.ts` (deadline display for null)
- **Migration**: Enable pg_cron extension, create cron job. No schema changes (deadline already nullable, status enum already has `playlist_ready`).
- **RLS**: Tape update policy already allows session admins to update tapes. pg_cron runs as superuser, bypasses RLS.
