## MODIFIED Requirements

### Requirement: Action button for playlist_ready navigates to comment page
The session home card action button for `playlist_ready` status SHALL navigate to `/session/:sessionId/tape/:tapeId/comment?action=comment` instead of the session view. The label SHALL be "Listen & Comment".

#### Scenario: Playlist ready action button
- **WHEN** user taps the action button on a session card with a playlist_ready tape
- **THEN** they SHALL navigate to the Listen & Comment page for that tape
