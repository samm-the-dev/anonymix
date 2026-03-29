## MODIFIED Requirements

### Requirement: Auto-completion trigger
A Postgres trigger on tapes SHALL check after every status update whether all tapes in the session are in a terminal state (`results` or `skipped`). If so, the session's `ended` column SHALL be set to `true`.

#### Scenario: Last tape completes
- **WHEN** the final tape in a session transitions to `results`
- **THEN** the session's `ended` SHALL be set to `true`

#### Scenario: Last tape skipped
- **WHEN** the final tape is `skipped` and all other tapes are terminal
- **THEN** the session's `ended` SHALL be set to `true`

#### Scenario: Not all tapes done
- **WHEN** a tape transitions to `results` but other tapes are still `submitting`
- **THEN** the session's `ended` SHALL remain `false`

### Requirement: Completed timestamp
The sessions table SHALL have a `completed_at` timestamptz column. It SHALL be set by the auto-completion trigger when `ended` is set to `true`.

#### Scenario: Session completes
- **WHEN** the auto-completion trigger fires
- **THEN** `completed_at` SHALL be set to the current timestamp
