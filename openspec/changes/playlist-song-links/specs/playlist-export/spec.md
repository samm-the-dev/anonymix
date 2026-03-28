## MODIFIED Requirements

### Requirement: Playlist song list display
When the active tape is in `playlist_ready` or `results` status, the session view SHALL display all submissions as a list of cards showing album art thumbnail (if available), song name, artist name, and an "Open" button (if song.link URL resolved).

#### Scenario: Playlist card with art and link
- **WHEN** a submission has cover art and a resolved song.link URL
- **THEN** the card SHALL show a thumbnail, song name, artist, and an Open button

#### Scenario: Playlist card minimal
- **WHEN** a submission has no cover art and no song.link URL (manual entry)
- **THEN** the card SHALL show song name and artist only, with a placeholder or no image

### Requirement: Design deviation — updated
The original deviation noted "no per-song platform buttons." This is now partially resolved: per-song universal links via Odesli/song.link are available for submissions with MusicBrainz IDs. Platform-specific deep-links (direct Spotify/YouTube open) remain deferred.

#### Scenario: Universal link instead of platform-specific
- **WHEN** user taps Open on a song
- **THEN** the song.link universal page SHALL open, allowing the user to choose their platform
