## MODIFIED Requirements

### Requirement: Results tape card navigates to reveal
When the active tape is in `results` status, the tape card SHALL show a "See Reveal" button that navigates to `/session/:sessionId/tape/:tapeId/reveal`.

#### Scenario: Results card
- **WHEN** a tape is in `results` status
- **THEN** the card SHALL show a "See Reveal" button

#### Scenario: See Reveal navigates
- **WHEN** user taps "See Reveal"
- **THEN** they SHALL navigate to the reveal page for that tape

### Requirement: Host advance to results
When the active tape is in `playlist_ready` status and the user is the host, a "Reveal" button SHALL appear below the "Listen & Comment" button. Tapping it advances the tape to `results`.

#### Scenario: Host reveals
- **WHEN** host taps "Reveal" on a playlist_ready tape
- **THEN** the tape status SHALL update to `results`
