## ADDED Requirements

### Requirement: Deadline set on first submission
A Postgres trigger on the `submissions` table SHALL set the tape's `deadline` to `now() + (submit_window_hours * interval '1 hour')` when the first submission is inserted for that tape (i.e., when the tape's deadline is currently null).

#### Scenario: First submission starts the timer
- **WHEN** the first player submits to a tape with null deadline
- **THEN** the tape's deadline SHALL be set to now plus the tape's submit_window_hours

#### Scenario: Subsequent submissions don't change deadline
- **WHEN** a second player submits to a tape that already has a deadline
- **THEN** the deadline SHALL remain unchanged

### Requirement: Submit window stored on tape
The `tapes` table SHALL have a `submit_window_hours` column (integer, not null, default 48) storing the submission window duration in hours.

#### Scenario: Tape created with custom window
- **WHEN** a host creates a session with a 3-day submit window
- **THEN** the tape's `submit_window_hours` SHALL be 72

### Requirement: pg_cron auto-advances expired tapes
A pg_cron job SHALL run every 30 minutes and update any tape with `status = 'submitting'` AND `deadline < now()` to `status = 'playlist_ready'`.

#### Scenario: Tape deadline passes
- **WHEN** a tape's deadline has passed and the cron job runs
- **THEN** the tape's status SHALL be updated to `playlist_ready`

#### Scenario: Tape without deadline unaffected
- **WHEN** a tape has null deadline (no submissions yet)
- **THEN** the cron job SHALL not modify it
