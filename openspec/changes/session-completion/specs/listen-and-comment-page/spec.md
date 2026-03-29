## MODIFIED Requirements

### Requirement: Default to Import playlist tab on completed sessions
When opening a tape page for a completed session, the info card tab SHALL default to "Import playlist" instead of "Commenting".

#### Scenario: Completed session tape page
- **WHEN** user opens a tape page for a session where `ended = true`
- **THEN** the "Import playlist" tab SHALL be selected by default
