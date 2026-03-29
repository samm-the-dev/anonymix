## ADDED Requirements

### Requirement: Song search with MusicBrainz autocomplete
The submission flow SHALL provide a full-screen search overlay with a text input that queries the MusicBrainz API (`/ws/2/recording`) with 350ms debounce. Results SHALL display song title, artist, and album. Selecting a result SHALL fill the input and prepare the submission.

Reference: [01.3-tape-submission spec](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.3-tape-submission/01.3-tape-submission.md), [tape-submission.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/tape-submission.html)

#### Scenario: Autocomplete search
- **WHEN** user types "radiohead creep" in the search input
- **THEN** the system SHALL query MusicBrainz and display matching recordings with title, artist, and album

#### Scenario: Select search result
- **WHEN** user taps a search result
- **THEN** the input SHALL update to "Artist - Title" and the Submit button SHALL become enabled

### Requirement: Manual entry fallback
If the user types a query but no search results match, a "Use as manual entry" link SHALL appear. Clicking it SHALL parse the query as "Artist - Title" (if hyphen present) or use the full text as the song name.

#### Scenario: Manual entry with artist
- **WHEN** user types "My Chemical Romance - Welcome to the Black Parade" and clicks manual entry
- **THEN** the submission SHALL be prepared with artist "My Chemical Romance" and title "Welcome to the Black Parade"

### Requirement: Submit song
Clicking Submit SHALL insert a record into the `submissions` table with `tape_id`, `player_id`, `song_name`, and `artist_name`. The unique constraint `(tape_id, player_id)` SHALL enforce one submission per player per tape.

#### Scenario: Successful submission
- **WHEN** user selects a song and clicks Submit
- **THEN** a submission record SHALL be created and the search overlay SHALL close, showing the submission on the tape view

### Requirement: Change existing submission
If the user has already submitted, the tape view SHALL show their current pick with a "Change" link. Clicking Change SHALL re-open the search overlay. Submitting again SHALL update the existing record.

#### Scenario: Change submission
- **WHEN** user clicks Change and selects a new song
- **THEN** the existing submission record SHALL be updated with the new song name and artist

### Requirement: Search overlay close
The search overlay SHALL have an X button in the top-right that closes it and returns to the tape view without submitting.

#### Scenario: Cancel search
- **WHEN** user opens the search overlay and clicks X
- **THEN** the overlay SHALL close without creating or modifying a submission
