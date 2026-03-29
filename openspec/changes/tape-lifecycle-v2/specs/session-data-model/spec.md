## MODIFIED Requirements

### Requirement: Comment window duration on tapes
The tapes table SHALL have a `comment_window_hours` column (integer, not null, default 120). When a tape transitions to `playlist_ready`, its deadline SHALL be set to `now() + comment_window_hours`.

#### Scenario: Tape enters playlist_ready
- **WHEN** a tape transitions from `submitting` to `playlist_ready`
- **THEN** its deadline SHALL be set to `now() + comment_window_hours`

#### Scenario: Comment deadline expires
- **WHEN** a `playlist_ready` tape's deadline passes
- **THEN** the cron job SHALL advance it to `results`

### Requirement: Upcoming status in tape_status enum
The `tape_status` enum SHALL include `upcoming` as a valid value. Tapes in `upcoming` status have no deadline and accept no submissions.

#### Scenario: Upcoming tape blocks submissions
- **WHEN** a player attempts to submit to an `upcoming` tape
- **THEN** the submission SHALL be rejected (RLS or UI prevents it)
