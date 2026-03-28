## MODIFIED Requirements

### Requirement: Tapes created with null deadline
When creating a session, tapes SHALL be created with `deadline = null` and `submit_window_hours` set from the host's timing configuration. The deadline is set later by the database trigger when the first submission arrives.

#### Scenario: New tape has no deadline
- **WHEN** a host creates a session with tapes
- **THEN** each tape SHALL have null deadline and submit_window_hours matching the configured submit window
