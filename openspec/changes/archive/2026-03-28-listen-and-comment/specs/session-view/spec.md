## MODIFIED Requirements

### Requirement: Simplified playlist_ready tape card
When the active tape is in `playlist_ready` status, the tape card in the session view SHALL show the tape title, prompt, a comment progress indicator (X/Y commented), and a "Listen & Comment" action button. The song list and TMM controls SHALL NOT appear in the tape card — they are on the dedicated page.

#### Scenario: Playlist ready card
- **WHEN** a tape is in `playlist_ready` status
- **THEN** the card SHALL show the prompt, comment progress, and "Listen & Comment" button only

#### Scenario: Listen & Comment button navigates
- **WHEN** user taps "Listen & Comment" on the tape card
- **THEN** they SHALL navigate to `/session/:sessionId/tape/:tapeId/comment`
