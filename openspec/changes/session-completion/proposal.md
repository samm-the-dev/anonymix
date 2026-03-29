## Why

Sessions have no end state. When all tapes reach `results` or `skipped`, the session just sits there looking like it's still active. The `ended` column exists on sessions but is never set. Players have no sense of closure — no summary, no stats, no "we did it" moment. The session should wrap up automatically with a small celebration.

## What Changes

- **Auto-completion trigger**: Postgres trigger sets `ended = true` when the last tape in a session reaches a terminal state (`results` or `skipped`)
- **Session summary header**: When a session is ended, the session view shows a completion summary above the tape crate — total songs, total comments, tapes completed, most-commented songs, most active commenters
- **Completed session browsing**: Existing crate UI stays — user can flip through all tapes and view results. Tape pages for completed sessions default to the "Import playlist" tab (commenting is done, playlist import stays useful)
- **Session card**: Completed sessions already move to the "Completed" section on the home page via the `ended` filter

## Non-goals

- Achievements or badges
- Session-level leaderboard or ranking
- Export/share session summary
- Restarting or extending a completed session

## Capabilities

### New Capabilities
- `session-summary`: Completion summary view with aggregated stats

### Modified Capabilities
- `session-data-model`: Trigger to auto-set `ended = true`
- `session-view`: Show summary header when session is ended
- `listen-and-comment-page`: Default to "Import playlist" tab when session is ended

## Impact

- Migration: Postgres trigger on tapes AFTER UPDATE
- `src/pages/SessionViewPage.tsx` — summary header component
- `src/pages/ListenCommentPage.tsx` — default tab selection
- No new tables or columns (uses existing `ended` boolean)
