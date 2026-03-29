## MODIFIED Requirements

### Requirement: Tape card deadline display
The tape card SHALL display deadline state contextually:
- **No deadline (null)**: Show "Waiting for first submission" instead of a countdown
- **Deadline set**: Show countdown as before
- **Deadline passed (client-side)**: Show "Submissions closing..." even before cron runs

#### Scenario: Pre-first-submission tape
- **WHEN** a tape is in `submitting` status with null deadline
- **THEN** the card SHALL display "Waiting for first submission" instead of a deadline countdown

#### Scenario: Deadline passed but cron hasn't run
- **WHEN** a tape's deadline is in the past but status is still `submitting`
- **THEN** the card SHALL display "Submissions closing..." and disable the submit button
