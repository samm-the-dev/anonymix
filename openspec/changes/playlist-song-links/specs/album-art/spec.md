## ADDED Requirements

### Requirement: Fetch album art at submission time
When a user selects a song from MusicBrainz search results, the system SHALL fetch album cover art from the Cover Art Archive (`https://coverartarchive.org/release/{releaseId}/front-250`). The resulting image URL SHALL be stored with the submission.

#### Scenario: Album art found
- **WHEN** user selects a MusicBrainz result with a release ID
- **THEN** the system SHALL fetch the cover art URL and display it in the song preview (replacing the gray placeholder)

#### Scenario: Album art not found
- **WHEN** the Cover Art Archive returns 404 for the release
- **THEN** the gray placeholder SHALL remain and the submission SHALL proceed without a cover art URL

#### Scenario: Manual entry has no art
- **WHEN** user submits via manual text entry (no MusicBrainz result)
- **THEN** no cover art lookup SHALL occur and the placeholder SHALL remain

### Requirement: Display album art on playlist cards
When a tape is in `playlist_ready` or `results` status, each song card in the playlist view SHALL display the stored cover art image (if available) as a small thumbnail alongside the song name and artist.

#### Scenario: Playlist card with art
- **WHEN** a submission has a `cover_art_url`
- **THEN** the playlist card SHALL display a 40x40 rounded thumbnail of the cover art

#### Scenario: Playlist card without art
- **WHEN** a submission has no `cover_art_url`
- **THEN** the playlist card SHALL display a gray placeholder or no image
