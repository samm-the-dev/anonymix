## ADDED Requirements

### Requirement: Listen & Comment page
A dedicated page at `/session/:sessionId/tape/:tapeId/comment` SHALL display the tape prompt, expandable TMM instructions, per-song comment fields, a "The Tape" overall comment field, and a submit button.

Reference: [01.5-tape-voting spec](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.5-tape-voting/01.5-tape-voting.md), [tape-voting.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/tape-voting.html)

#### Scenario: Page renders with submissions
- **WHEN** user navigates to the comment page for a playlist_ready tape with 5 submissions
- **THEN** the page SHALL show 4 songs (excluding user's own) with comment fields, plus "The Tape" field

### Requirement: Expandable TMM instructions
The page SHALL have a collapsible section with playlist import instructions: platform dropdown, "Copy & open Tune My Music" button, and step-by-step instructions. The section SHALL be expanded on first visit and collapsed on subsequent visits (tracked via localStorage).

#### Scenario: First visit shows instructions expanded
- **WHEN** user visits the comment page for the first time
- **THEN** the TMM instructions section SHALL be expanded

#### Scenario: Return visit shows instructions collapsed
- **WHEN** user has previously visited a comment page (localStorage flag set)
- **THEN** the TMM instructions section SHALL be collapsed with a toggle to expand

### Requirement: Per-song comment fields
Each submission (excluding the current user's own) SHALL be displayed as a row with album art thumbnail, song name, artist, and an optional comment textarea. Comments are anonymous — no submitter names shown.

#### Scenario: User's own submission excluded
- **WHEN** user has a submission on this tape
- **THEN** their own song SHALL NOT appear in the comment list

#### Scenario: Comment left on a song
- **WHEN** user types a comment in a song's textarea
- **THEN** the comment text SHALL be included in the bulk submission when "Submit" is clicked

### Requirement: "The Tape" overall comment
A separate comment field labeled "The Tape" SHALL allow the user to react to the tape as a whole. It is optional.

#### Scenario: Tape-level comment submitted
- **WHEN** user writes a tape-level comment and clicks Submit
- **THEN** a comment record SHALL be inserted with `submission_id = null` and the tape-level text

### Requirement: Submit comments
A "Submit comments" button SHALL bulk-insert all non-empty comments into the comments table. Per-song comments SHALL include the `submission_id`. The tape-level comment SHALL have `submission_id = null`. After submission, the user SHALL be navigated back to the session view.

#### Scenario: Submit with mixed comments
- **WHEN** user writes comments on 2 of 4 songs plus a tape comment and clicks Submit
- **THEN** 3 comment records SHALL be inserted (2 per-song + 1 tape-level) and empty fields SHALL be skipped

### Requirement: No-pressure framing
The page SHALL include copy matching the prototype's tone: "Comment on a song that surprised you, a pick that nailed the theme, or just what you vibed with." and "No worries." — communicating that commenting is optional per song.

#### Scenario: Framing text visible
- **WHEN** the comment page renders
- **THEN** the low-pressure framing text SHALL be visible below the tape prompt

### Requirement: Per-submission comment schema
The comments table SHALL have a nullable `submission_id` column (FK to submissions, cascade delete). Per-song comments reference the submission. Tape-level comments have null submission_id.

#### Scenario: Per-song comment stored
- **WHEN** a per-song comment is submitted
- **THEN** the comment record SHALL have `tape_id`, `player_id`, `submission_id` (not null), and `text`

#### Scenario: Tape-level comment stored
- **WHEN** a tape-level comment is submitted
- **THEN** the comment record SHALL have `tape_id`, `player_id`, `submission_id = null`, and `text`
