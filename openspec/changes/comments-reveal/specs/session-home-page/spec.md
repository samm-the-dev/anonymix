## MODIFIED Requirements

### Requirement: Action button for results navigates to reveal page
The session home card action button for `results` status SHALL navigate to `/session/:sessionId/tape/:tapeId/reveal`. The label SHALL be "Reveal".

#### Scenario: Results action button
- **WHEN** user taps the action button on a session card with a results tape
- **THEN** they SHALL navigate to the reveal page for that tape
