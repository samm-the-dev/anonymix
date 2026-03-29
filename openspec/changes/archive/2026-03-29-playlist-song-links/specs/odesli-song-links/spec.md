## ADDED Requirements

### Requirement: Resolve song.link URLs at playlist view time
When the playlist view loads for a tape in `playlist_ready` or `results` status, the system SHALL resolve each submission's MusicBrainz recording ID to a universal song.link URL via the Odesli API (`https://api.song.link/v1-alpha.1/links?url=https://musicbrainz.org/recording/{id}`).

#### Scenario: Successful resolution
- **WHEN** the playlist loads and a submission has a MusicBrainz recording ID
- **THEN** the system SHALL call Odesli and cache the resulting `pageUrl` in component state

#### Scenario: Resolution failure
- **WHEN** Odesli returns an error or no match for a recording
- **THEN** the "Open" button SHALL not appear for that song

#### Scenario: No MusicBrainz ID (manual entry)
- **WHEN** a submission was entered manually without a MusicBrainz result
- **THEN** no Odesli lookup SHALL occur and no "Open" button SHALL appear

### Requirement: Rate-limited sequential resolution
Odesli lookups SHALL be sequential with at least 200ms delay between requests to stay within the 10 req/min rate limit. Results SHALL be cached in component state to avoid re-fetching.

#### Scenario: Playlist with 6 songs
- **WHEN** a playlist loads with 6 submissions that have MusicBrainz IDs
- **THEN** the system SHALL resolve them sequentially over ~1.2 seconds, not in parallel

### Requirement: Per-song Open button
Each song card in the playlist view SHALL display an "Open" button (ExternalLink icon) when a song.link URL is available. Tapping it SHALL open the song.link page in a new browser tab.

#### Scenario: Open song.link
- **WHEN** user taps the Open button on a resolved song
- **THEN** the song.link universal page SHALL open in a new tab, where the user can choose their platform
