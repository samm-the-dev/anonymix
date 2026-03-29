## Why

The tape lifecycle has three gaps that undermine the host's pacing control:

1. **No sequencing** — All tapes start in `submitting` simultaneously. Nothing prevents players from submitting to tape 3 while tape 1 is still open. The host creates a sequence but can't enforce it.
2. **Comment window not wired** — The create session UI has a "comment days" input, but `comment_window_hours` isn't stored on tapes and there's no auto-advance from `playlist_ready` → `results`.
3. **TapePage routing broken for edge states** — Navigating to a `skipped` or `submitting` tape renders the ListenCommentPage, which shows confusing content ("No one submitted this round" with a comment UI).

These are all tape lifecycle issues that should be addressed together.

Reference: [01-the-enthusiasts-round scenario](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01-the-enthusiasts-round.md), [tape-lifecycle migration](supabase/migrations/20260328011939_tape_lifecycle.sql)

## What Changes

- New `upcoming` tape status — tapes created in `upcoming`, only the first tape starts in `submitting`. When a tape completes (reaches `results` or `skipped`), the next `upcoming` tape auto-advances to `submitting`.
- Add `comment_window_hours` column to tapes — set during session creation alongside `submit_window_hours`. Deadline set when tape enters `playlist_ready`, auto-advance to `results` via cron.
- Fix TapePage routing — `skipped` shows a simple "Skipped" message, `submitting` redirects to session view, only `playlist_ready` and `results` render their respective pages.
- Auto-advance chain: when a tape reaches `results` or `skipped`, trigger the next `upcoming` tape to `submitting`.

## Non-goals

- Tape reordering (host can't change tape order after creation)
- Skipped tape recovery / reopen
- Notification layer (separate concern, planned separately)
- Co-host support

## Capabilities

### New Capabilities
- `tape-sequencing`: Auto-advance chain from upcoming → submitting when previous tape completes

### Modified Capabilities
- `session-data-model`: Add `comment_window_hours` to tapes, add `upcoming` to tape_status enum
- `session-view`: Show upcoming tapes as non-interactive spines, handle new status in tape card
- `create-session`: Wire comment days input to `comment_window_hours` on tape rows

## Impact

- Migration: add `upcoming` to tape_status enum, add `comment_window_hours` column, update cron job, add trigger for auto-advance chain
- `src/pages/TapePage.tsx` — routing fix for skipped/submitting
- `src/pages/SessionViewPage.tsx` — upcoming tape display, comment deadline
- `src/pages/CreateSessionPage.tsx` — wire comment_window_hours
- `src/lib/types.ts`, `src/lib/database.types.ts` — new status
- `src/components/StatusBadge.tsx`, `src/components/SessionCard.tsx` — upcoming status support
