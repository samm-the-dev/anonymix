## Context

Sessions have an `ended` boolean column that is never set to `true`. When all tapes finish, the session still appears active. The session home page already filters by `ended` for the Active/Completed sections, so setting the flag is all that's needed to move the card. The session view needs a summary header for the completed state.

## Goals / Non-Goals

**Goals:**
- Auto-detect and mark sessions as complete via DB trigger
- Show a compact summary with stats when viewing a completed session
- Keep existing tape browsing (crate flip) for completed sessions
- Default tape pages to "Import playlist" tab when session is ended

**Non-Goals:**
- Session restart or extension
- Exportable summary
- Per-player stats page

## Decisions

### 1. Postgres trigger for auto-completion

**Decision**: A trigger on `tapes` AFTER UPDATE that checks if ALL tapes in the session are in a terminal state (`results` or `skipped`). If so, sets `ended = true` and `completed_at = now()` on the session. Wait — `completed_at` doesn't exist. We'll add it.

**Implementation**:
```sql
CREATE FUNCTION check_session_complete() RETURNS trigger AS $$
BEGIN
  IF NEW.status IN ('results', 'skipped') THEN
    IF NOT EXISTS (
      SELECT 1 FROM tapes
      WHERE session_id = NEW.session_id
        AND status NOT IN ('results', 'skipped')
    ) THEN
      UPDATE sessions
      SET ended = true
      WHERE id = NEW.session_id AND NOT ended;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Why trigger over client-side**: Atomic, reliable regardless of which action completes the last tape (host click, cron job, etc.). Client-side check would be a race condition waiting to happen.

### 2. Summary stats (computed client-side)

**Decision**: Compute stats from the data already fetched on session view load (submissions + comments). No server-side aggregation needed — the data set is small (tens of songs, hundreds of comments max).

**Stats displayed:**
- Tapes completed: `N` (excluding skipped)
- Songs shared: total submission count
- Comments left: total comment count
- Most-commented songs: song(s) with highest comment count (show ties)
- Most active commenters: player(s) who left the most comments (show ties)

**Layout**: A compact section between the context bar and the tape crate, only shown when `ended = true`. Collapsible so it doesn't overwhelm the browsing experience.

### 3. Default tab on completed sessions

**Decision**: When a session is ended and the user opens a tape page, the info card tab defaults to "Import playlist" instead of "Commenting". The commenting framing text is less relevant after the session is over — playlist import stays useful for revisiting songs.

**Implementation**: Pass an `ended` flag to ListenCommentPage via TapePage. Use it to set the initial tab state.

### 4. Migration: add completed_at to sessions

**Decision**: Add `completed_at timestamptz` column to sessions. Set by the trigger alongside `ended = true`. Useful for "completed 3 days ago" display on session cards and sorting.

**Why**: The `ended` boolean alone doesn't capture when. The timestamp enables relative time display and chronological sorting of completed sessions.

## Risks / Trade-offs

- **Trigger on every tape update**: The `check_session_complete` trigger fires on every tape status change, but the query is fast (indexed by session_id, small result set). No performance concern at this scale.
- **No undo**: Once ended, a session can't be reopened. This is intentional — matches the "mixtape is done" metaphor. If the host adds tapes later, that's a new session.
