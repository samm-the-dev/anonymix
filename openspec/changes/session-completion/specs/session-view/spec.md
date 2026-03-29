## MODIFIED Requirements

### Requirement: Completed session view
When viewing a completed session (`ended = true`), the session view SHALL show the summary section between the context bar and the tape crate. The tape crate SHALL remain fully browsable — all tapes visible with their final states.

#### Scenario: Browsing completed session
- **WHEN** user opens a completed session
- **THEN** the summary section SHALL be visible and all tapes SHALL be browsable via the crate

### Requirement: No action buttons on completed sessions
When a session is ended, tape cards SHALL NOT show action buttons (submit, listen & comment, etc.) or host controls. The "View Comments" button for results tapes SHALL remain.

#### Scenario: Completed tape card
- **WHEN** user views a tape card in a completed session
- **THEN** only the "View Comments" button SHALL be available (for results tapes)
