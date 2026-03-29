## ADDED Requirements

### Requirement: Session card layout
Each session SHALL render as a card containing, top to bottom: (1) session title and overflow dots menu, (2) session description, (3) overlapping avatar circles for all players, (4) current tape title and prompt (active sessions only), (5) action row with View button, status badge + deadline, and action button.

Reference: [01.1-session-home spec](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.1-session-home/01.1-session-home.md), [session-home.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/session-home.html)

#### Scenario: Active session card renders all sections
- **WHEN** a session has an active tape in `submitting` status
- **THEN** the card SHALL display the session title, dots menu, description, avatar row, tape title, prompt, and action row with Submit button

#### Scenario: Completed session card omits tape info
- **WHEN** a session is marked as ended
- **THEN** the card SHALL display the session title, description, avatar row, and action row, but SHALL NOT display a tape title or prompt

### Requirement: Dots menu with invite, export, delete
The session card overflow menu SHALL contain three items: Invite (copies/shares join link), Export (downloads `.anonymix.json` blueprint), and Delete (opens confirmation dialog). Delete SHALL be styled in red.

#### Scenario: Invite from dots menu
- **WHEN** user clicks Invite in the dots menu
- **THEN** the native share sheet SHALL open (or the join link SHALL be copied to clipboard as fallback)

#### Scenario: Export from dots menu
- **WHEN** user clicks Export in the dots menu
- **THEN** a `.anonymix.json` file SHALL be downloaded with the session's name, description, and tapes

#### Scenario: Delete with confirmation
- **WHEN** user clicks Delete and confirms in the dialog
- **THEN** the session SHALL be deleted from Supabase (cascading to tapes, submissions, comments) and the session list SHALL refresh

### Requirement: Status badge with color coding
The action row SHALL display a status badge with color coding: Submitting (green), Commenting (amber), Playlist Ready (blue), Completed/Results (purple). Badge text SHALL be uppercase, small font.

#### Scenario: Each status renders correct color
- **WHEN** a tape has status `submitting`
- **THEN** the badge SHALL render with green background and green text
- **WHEN** a tape has status `commenting`
- **THEN** the badge SHALL render with amber background and amber text
- **WHEN** a tape has status `playlist_ready`
- **THEN** the badge SHALL render with blue background and blue text
- **WHEN** a tape has status `results`
- **THEN** the badge SHALL render with purple background and purple text

### Requirement: Action button states and deep-linking
The action button SHALL reflect the tape status and whether the user has completed the action. Actionable states (submitting, commenting) SHALL show a filled button with the action label. After the user has acted, the label SHALL change (Submit → Change, Comment → Commented). Non-actionable states (playlist_ready, results) SHALL show persistent action labels (Listen, Results). Action buttons SHALL navigate to the session view with action-specific query parameters: `?action=submit` for submitting, `?action=comment` for commenting.

#### Scenario: Submit button deep-links to search
- **WHEN** user clicks "Submit" on a session card
- **THEN** they SHALL navigate to `/session/:id?action=submit` which auto-opens the song search

#### Scenario: User has submitted
- **WHEN** tape status is `submitting` and user has submitted
- **THEN** the action button SHALL display "Change" with a filled green style

#### Scenario: User has not commented
- **WHEN** tape status is `commenting` and user has not commented
- **THEN** the action button SHALL display "Comment" with a filled amber style

#### Scenario: User has commented
- **WHEN** tape status is `commenting` and user has commented
- **THEN** the action button SHALL display "Commented" with a muted/disabled style

#### Scenario: Playlist ready
- **WHEN** tape status is `playlist_ready`
- **THEN** the action button SHALL display "Listen" with a filled blue style

#### Scenario: Results
- **WHEN** tape status is `results`
- **THEN** the action button SHALL display "Results" with a filled purple style

### Requirement: Deadline display
The action row SHALL display a deadline relative to now. Submitting and commenting tapes SHALL show "due today", "due tomorrow", "due in N days", or "due (overdue)". Playlist Ready SHALL show no deadline. Results SHALL show relative completion time ("today", "yesterday", "N days ago", "~N months ago").

#### Scenario: Deadline tomorrow
- **WHEN** tape deadline is 1 day from now
- **THEN** the deadline text SHALL display "due tomorrow"

#### Scenario: Results completed recently
- **WHEN** tape status is `results` and completedAt is 5 days ago
- **THEN** the deadline text SHALL display "5 days ago"

#### Scenario: No deadline
- **WHEN** tape status is `playlist_ready`
- **THEN** no deadline text SHALL be displayed

### Requirement: Avatar row
The session card SHALL display overlapping circular avatars for all players in the session. Avatars SHALL show the player's emoji character on a colored background. Avatars SHALL overlap with negative margin, with the first avatar having no offset.

#### Scenario: Multiple players render overlapping
- **WHEN** a session has 5 players
- **THEN** 5 avatar circles SHALL render with overlapping layout (negative left margin on all but the first)

### Requirement: Collapsible sections
Sessions SHALL be grouped into "Active" and "Completed" sections. Each section SHALL have a header with a chevron indicator and session count. The Active section SHALL be expanded by default. The Completed section SHALL be collapsed by default. Tapping a section header SHALL toggle its expanded/collapsed state with an animation.

#### Scenario: Active section expanded on load
- **WHEN** the page loads
- **THEN** the Active section SHALL be expanded showing session cards, and the Completed section SHALL be collapsed

#### Scenario: Toggle section
- **WHEN** the user taps the Completed section header
- **THEN** the section SHALL expand with a smooth transition revealing completed session cards

### Requirement: New Session button
The session home page SHALL display a "New Session" button above the active sessions section, navigating to `/create`.

#### Scenario: Create session navigation
- **WHEN** user clicks "New Session"
- **THEN** they SHALL navigate to the create session page

### Requirement: Bottom navigation bar
A fixed bottom navigation bar SHALL display two items: Sessions (home icon, links to `/`) and Profile (user's emoji avatar + name, links to `/profile`). The active item SHALL be highlighted with the primary color.

#### Scenario: Active nav highlighting
- **WHEN** user is on the home page
- **THEN** the Sessions nav item SHALL be highlighted in primary color

### Requirement: App header with cassette icon
The app header SHALL display the CassetteTape lucide icon alongside "Anonymix" text, centered, with a theme toggle on the right.

#### Scenario: Header renders icon and title
- **WHEN** the layout renders
- **THEN** the header SHALL show the cassette tape icon next to "Anonymix"

### Requirement: Responsive layout
On mobile viewports, session cards SHALL stack vertically with full width. On desktop viewports (breakpoint TBD), session cards MAY render in a grid layout.

#### Scenario: Mobile layout
- **WHEN** viewport width is less than the desktop breakpoint
- **THEN** session cards SHALL render in a single column, full width

### Requirement: Action button for playlist_ready navigates to comment page
The session home card action button for `playlist_ready` status SHALL navigate to `/session/:sessionId/tape/:tapeId/comment?action=comment` instead of the session view. The label SHALL be "Listen & Comment".

#### Scenario: Playlist ready action button
- **WHEN** user taps the action button on a session card with a playlist_ready tape
- **THEN** they SHALL navigate to the Listen & Comment page for that tape

### Requirement: View button navigation
Each session card's "View" button SHALL navigate to `/session/:sessionId`.

#### Scenario: View button click
- **WHEN** the user taps "View" on a session card
- **THEN** the app SHALL navigate to `/session/:sessionId`
