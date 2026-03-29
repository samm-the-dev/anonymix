## ADDED Requirements

### Requirement: Host can close submissions early
The session admin SHALL be able to close submissions on an active tape, immediately advancing its status from `submitting` to `playlist_ready`. This SHALL be accessible from the session view.

#### Scenario: Host closes submissions
- **WHEN** the session admin taps "Close submissions" on a submitting tape
- **THEN** the tape's status SHALL immediately change to `playlist_ready`

#### Scenario: Non-admin cannot close submissions
- **WHEN** a non-admin player views a submitting tape
- **THEN** no "Close submissions" option SHALL be visible
