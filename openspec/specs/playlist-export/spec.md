## ADDED Requirements

### Requirement: Playlist song list display
When the active tape is in `playlist_ready` or `results` status, the session view SHALL display all submissions as a list of cards showing song name and artist name.

Reference: [01.4-tape-playlist-ready spec](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.4-tape-playlist-ready/01.4-tape-playlist-ready.md)

#### Scenario: Playlist renders all submissions
- **WHEN** a tape in `playlist_ready` status has 6 submissions
- **THEN** all 6 songs SHALL be displayed as cards with song name and artist

### Requirement: Copy playlist for Tune My Music
A "Copy for Tune My Music" button SHALL copy all submissions as a newline-separated text list in "Artist - Song Name" format to the clipboard. An "Open Tune My Music" link SHALL open tunemymusic.com in a new tab.

#### Scenario: Copy playlist text
- **WHEN** user clicks "Copy for Tune My Music"
- **THEN** the clipboard SHALL contain one "Artist - Song Name" line per submission

#### Scenario: Open Tune My Music
- **WHEN** user clicks "Open Tune My Music"
- **THEN** tunemymusic.com SHALL open in a new browser tab

### Requirement: Design deviation — no platform deep-links
The prototype specifies per-platform "Open in Spotify/YouTube Music" buttons. The current implementation uses copy-paste to Tune My Music instead. This is an accepted design deviation due to Spotify API restrictions (5-user dev mode cap, 250k MAU for extended quota).

#### Scenario: No per-song platform buttons
- **WHEN** user views the playlist
- **THEN** individual songs SHALL NOT have "Open in Spotify" or "Open in YouTube Music" buttons (deferred)
