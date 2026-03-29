## Context

The tape lifecycle currently has 4 statuses: `submitting`, `playlist_ready`, `results`, `skipped`. All tapes start in `submitting` when the session is created. There's no sequencing — every tape is immediately open for submissions. The `comment_window_hours` field doesn't exist; only `submit_window_hours` controls pacing. The TapePage component renders ListenCommentPage for any non-results status, including `skipped` and `submitting` which produces confusing UI.

## Goals / Non-Goals

**Goals:**
- Enforce one-at-a-time tape sequencing via `upcoming` status
- Wire comment window pacing: `playlist_ready` gets a deadline, auto-advances to `results`
- Fix TapePage routing for `skipped` and `submitting` edge cases
- Auto-advance chain: completed tape triggers next upcoming tape to start

**Non-Goals:**
- Tape reordering after creation
- Skipped tape recovery
- Notifications (separate concern)

## Decisions

### 1. New `upcoming` status

**Decision**: Add `upcoming` to the `tape_status` enum. On session creation, only the first tape is `submitting`; all subsequent tapes are `upcoming`. When a tape reaches `results` or `skipped`, a Postgres trigger advances the next `upcoming` tape (by `created_at` order) to `submitting`.

**Why**: The host creates tapes in order. The sequence should be enforced — players focus on one tape at a time. The crate UI already shows tapes in order; this makes the data match the UI intent.

**Alternative**: Client-side gating (hide submit button on future tapes). Rejected — the state should be authoritative in the DB, not just a UI trick.

### 2. Auto-advance trigger

**Decision**: A Postgres trigger on `tapes` AFTER UPDATE that fires when `status` changes to `results` or `skipped`. It finds the next tape in the same session (by `created_at`) with status `upcoming` and sets it to `submitting`.

**Why**: This is the same pattern as the existing first-submission deadline trigger. Keeps the logic in the DB where it's atomic and reliable regardless of which client triggers the status change.

**Implementation**:
```sql
CREATE FUNCTION advance_next_tape() RETURNS trigger AS $$
BEGIN
  IF NEW.status IN ('results', 'skipped') AND OLD.status != NEW.status THEN
    UPDATE tapes SET status = 'submitting'
    WHERE session_id = NEW.session_id
      AND status = 'upcoming'
      AND id != NEW.id
    ORDER BY created_at
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. Comment window pacing

**Decision**: Add `comment_window_hours` column to tapes (integer, not null, default 120). Set during session creation from the existing "comment days" UI input. When a tape transitions to `playlist_ready`, a trigger sets `deadline = now() + comment_window_hours`. The existing cron job is extended to also advance expired `playlist_ready` tapes to `results`.

**Why**: Mirrors the existing submission deadline pattern exactly. The UI already collects the value — just needs to be stored and used.

**Deadline trigger**: Reuse the pattern from `set_tape_deadline_on_first_submission` but for the `playlist_ready` transition. A trigger on tapes AFTER UPDATE that sets deadline when status changes to `playlist_ready`.

### 4. Cron job update

**Decision**: Extend the existing cron job to handle three cases:
1. `submitting` + deadline passed + has submissions → `playlist_ready`
2. `submitting` + deadline passed + no submissions → `skipped`
3. `playlist_ready` + deadline passed → `results`

The auto-advance trigger (decision #2) then handles `results` → next `upcoming` tape.

### 5. TapePage routing fix

**Decision**: Update TapePage to handle all statuses:
- `submitting` → redirect to session view (user should submit from the tape card)
- `upcoming` → redirect to session view (tape not active yet)
- `playlist_ready` → ListenCommentPage
- `results` → ResultsPage
- `skipped` → simple "Skipped" display (tape title + "No submissions this round")

**Why**: Each status has a clear appropriate view. Rendering ListenCommentPage for skipped/submitting/upcoming creates confusion.

### 6. Upcoming tape display in session view

**Decision**: Upcoming tapes show in the crate as non-interactive spines (same visual as now, but tapping shows a card with "Upcoming" badge and the prompt — no action buttons). The active tape is always a `submitting` or `playlist_ready` tape.

**Why**: Players should see what's coming but can't act on it yet. Maintains the crate-flip browsing experience.

## Risks / Trade-offs

- **Migration complexity**: Adding an enum value, a column, a trigger, and updating the cron — all in one migration. Mitigation: test the migration on a branch DB first.
- **Existing tapes**: Current tapes are all in `submitting` or later. No existing tapes need to be set to `upcoming`. Migration only affects new sessions going forward.
- **Auto-advance race condition**: If the cron and host both advance a tape simultaneously, the trigger could fire twice. Mitigation: the trigger's UPDATE with `LIMIT 1` and status check (`status = 'upcoming'`) is idempotent.
