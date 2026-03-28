## MODIFIED Requirements

### Requirement: Submit song
Clicking Submit SHALL insert a record into the `submissions` table with `tape_id`, `player_id`, `song_name`, `artist_name`, `musicbrainz_id` (nullable), `release_id` (nullable), and `cover_art_url` (nullable). The MusicBrainz IDs come from the search result; manual entries have null IDs.

#### Scenario: Submission from search result
- **WHEN** user selects a MusicBrainz result and clicks Submit
- **THEN** the submission SHALL include the recording ID, release ID, and resolved cover art URL

#### Scenario: Submission from manual entry
- **WHEN** user submits via manual text entry
- **THEN** `musicbrainz_id`, `release_id`, and `cover_art_url` SHALL be null

### Requirement: Song search returns release ID
The MusicBrainz search hook SHALL return the release ID (from `releases[0].id`) alongside the recording ID, title, artist, and album name. This enables Cover Art Archive lookups.

#### Scenario: Search result includes release ID
- **WHEN** MusicBrainz returns a recording with releases
- **THEN** the `SongResult` SHALL include a `releaseId` field
