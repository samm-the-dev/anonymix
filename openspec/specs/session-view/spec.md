## ADDED Requirements

### Requirement: Crate-flip tape navigation in session view
The session view SHALL display tapes using crate-flip navigation: active tape as a card with status badge, title, and prompt; past/future tapes as receding spines above/below. Spines SHALL be clickable to switch the active tape. The initial active tape SHALL be the first actionable tape (submitting/commenting/playlist_ready), or the most recent tape if none are actionable.

Reference: [01.2-tape-list spec](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.2-tape-list/01.2-tape-list.md), [session-view.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/session-view.html)

#### Scenario: Session with multiple tapes
- **WHEN** user opens a session with 5 tapes, tape 2 is in submitting status
- **THEN** tape 2 SHALL be the active card, tape 1 SHALL appear as a spine above, tapes 3-5 as spines below

### Requirement: Session header
The session view SHALL have a header with back button (navigates to `/`), centered session name, and empty right placeholder.

#### Scenario: Back navigation
- **WHEN** user clicks the back arrow
- **THEN** they SHALL navigate to the session home page

### Requirement: Per-tape content area
Below the crate, the session view SHALL display context-specific content based on the active tape's status:
- **submitting**: Submit button (or current submission with Change option)
- **playlist_ready/results**: Playlist song list with copy-for-Tune-My-Music button
- Submission count when in submitting status

#### Scenario: Submitting tape shows submit button
- **WHEN** the active tape is in `submitting` status and the user has not submitted
- **THEN** a "Submit a song" button SHALL be displayed

#### Scenario: Submitted tape shows current pick
- **WHEN** the active tape is in `submitting` status and the user has submitted
- **THEN** the submission SHALL be displayed with song name, artist, and a "Change" link

### Requirement: Action query parameter
The session view SHALL accept a `?action=submit` query parameter. When present and the active tape is in `submitting` status, the song search overlay SHALL open automatically.

#### Scenario: Deep-link to submit action
- **WHEN** user navigates to `/session/:id?action=submit`
- **THEN** the song search overlay SHALL open immediately after data loads

### Requirement: Simplified playlist_ready tape card
When the active tape is in `playlist_ready` status, the tape card in the session view SHALL show the tape title, prompt, a comment progress indicator (X/Y commented), and a "Listen & Comment" action button. The song list and TMM controls SHALL NOT appear in the tape card — they are on the dedicated page.

#### Scenario: Playlist ready card
- **WHEN** a tape is in `playlist_ready` status
- **THEN** the card SHALL show the prompt, comment progress, and "Listen & Comment" button only

#### Scenario: Listen & Comment button navigates
- **WHEN** user taps "Listen & Comment" on the tape card
- **THEN** they SHALL navigate to `/session/:sessionId/tape/:tapeId/comment`
