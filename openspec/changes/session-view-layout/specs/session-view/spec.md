## MODIFIED Requirements

### Requirement: Crate-flip tape navigation in session view
The session view SHALL vertically center the tape crate (spines + active card) within the available viewport area between the session header and the bottom navigation bar. Centering SHALL be achieved by the page using `flex-1 flex items-center justify-center` on its content wrapper, with Layout's `<main>` providing `flex flex-col` context. Playlist song list (for playlist_ready/results) SHALL appear below the centered crate, scrollable.

Reference: [session-view.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/session-view.html) — `<main class="flex-1 flex items-center justify-center p-4">`

#### Scenario: Crate centered with few tapes
- **WHEN** a session has 1-3 tapes
- **THEN** the tape crate SHALL be vertically centered in the viewport area between header and bottom nav

#### Scenario: Crate with many tapes
- **WHEN** a session has many tapes with spines extending beyond viewport
- **THEN** the content SHALL scroll naturally without breaking centering

### Requirement: Extracted SubmissionProgress component
The submission progress bar (X/Y submitted count + progress bar) SHALL be extracted into a reusable `SubmissionProgress` component accepting `submitted` count, `total` count, and status color props.

#### Scenario: Progress bar renders correctly
- **WHEN** 3 of 6 players have submitted
- **THEN** the progress bar SHALL show "3/6 submitted" with a 50% filled bar in the status color
