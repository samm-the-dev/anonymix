## ADDED Requirements

### Requirement: Reveal page
A dedicated page at `/session/:sessionId/tape/:tapeId/reveal` SHALL display the tape prompt, and all submissions in shuffled order as an accordion list. Each accordion row shows album art, song title, and artist. Expanding a row reveals the submitter identity and all comments for that song.

Reference: [01.6-tape-reveal scenario](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.6-tape-reveal/01.6-tape-reveal.md), [tape-reveal.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/tape-reveal.html)

#### Scenario: Page renders with submissions
- **WHEN** user navigates to the reveal page for a tape with 5 submissions
- **THEN** 5 accordion rows SHALL be displayed in a stable shuffled order

### Requirement: Shuffled song order
Songs SHALL be displayed in a shuffled order seeded by the tape ID. All users SHALL see the same order. No ranking or implied hierarchy.

#### Scenario: Consistent order across users
- **WHEN** two users view the reveal for the same tape
- **THEN** both SHALL see the songs in the same shuffled order

### Requirement: Accordion submitter reveal
Each song accordion, when expanded, SHALL show "Submitted by [player name]" with the submitter's avatar. The submitter identity is hidden when collapsed.

#### Scenario: Expanding a song
- **WHEN** user taps a collapsed song row
- **THEN** the row expands to reveal the submitter name and avatar

#### Scenario: All start collapsed
- **WHEN** the reveal page loads
- **THEN** all accordion rows SHALL be collapsed

### Requirement: Per-song comments display
When a song accordion is expanded, all comments for that submission SHALL be displayed below the submitter info. Each comment shows the commenter's avatar, name, and text.

#### Scenario: Song with comments
- **WHEN** user expands a song that has 3 comments
- **THEN** 3 comments SHALL be shown with commenter identity

#### Scenario: Song with no comments
- **WHEN** user expands a song with no comments
- **THEN** a "No comments" message SHALL be shown

### Requirement: Tape-level comments
"The Tape" overall comments (comments with `submission_id = null`) SHALL be displayed at the bottom of the page, below the song accordion. Each shows commenter avatar, name, and text.

#### Scenario: Tape comments displayed
- **WHEN** a tape has 2 tape-level comments
- **THEN** both SHALL appear in a "The Tape" section at the bottom

### Requirement: Session context bar
The reveal page SHALL show a session context bar below the Layout app bar with the centered session name, matching the session view pattern.

#### Scenario: Context bar visible
- **WHEN** the reveal page renders
- **THEN** the session name SHALL be centered in a context bar below the app bar
