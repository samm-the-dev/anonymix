## MODIFIED Requirements

### Requirement: Comment window stored on tapes
When creating a session, the comment days input SHALL be stored as `comment_window_hours` (days × 24) on each tape row, alongside the existing `submit_window_hours`.

#### Scenario: Session created with 5-day comment window
- **WHEN** host creates a session with comment days set to 5
- **THEN** each tape SHALL have `comment_window_hours = 120`

### Requirement: First tape starts submitting, rest upcoming
When creating a session with multiple tapes, only the first tape SHALL be created with status `submitting`. All subsequent tapes SHALL be created with status `upcoming`.

#### Scenario: Create session with 3 tapes
- **WHEN** host creates a session with 3 tapes
- **THEN** tape 1 insert SHALL have `status = 'submitting'`
- **AND** tapes 2-3 inserts SHALL have `status = 'upcoming'`
