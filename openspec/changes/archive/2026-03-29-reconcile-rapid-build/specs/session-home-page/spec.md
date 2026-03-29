## MODIFIED Requirements

### Requirement: Session card layout
Each session SHALL render as a card containing, top to bottom: (1) session title and overflow dots menu, (2) session description, (3) overlapping avatar circles for all players, (4) current tape title and prompt (active sessions only), (5) action row with View button, status badge + deadline, and action button.

Reference: [01.1-session-home spec](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.1-session-home/01.1-session-home.md), [session-home.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/session-home.html)

#### Scenario: Active session card renders all sections
- **WHEN** a session has an active tape in `submitting` status
- **THEN** the card SHALL display the session title, dots menu, description, avatar row, tape title, prompt, and action row with Submit button

#### Scenario: Completed session card omits tape info
- **WHEN** a session is marked as ended
- **THEN** the card SHALL display the session title, description, avatar row, and action row, but SHALL NOT display a tape title or prompt

### Requirement: Action button deep-links to action
The action button SHALL navigate to the session view with action-specific query parameters: `?action=submit` for submitting status, `?action=comment` for commenting status. Other statuses SHALL navigate to the session view without params.

#### Scenario: Submit button opens search
- **WHEN** user clicks "Submit" on a session card
- **THEN** they SHALL navigate to `/session/:id?action=submit` which auto-opens the song search

## ADDED Requirements

### Requirement: Dots menu with invite, export, delete
The session card overflow menu SHALL contain three items: Invite (copies/shares join link), Export (downloads `.anonymix.json` blueprint), and Delete (opens confirmation dialog). Delete SHALL be styled in red.

#### Scenario: Invite from dots menu
- **WHEN** user clicks Invite in the dots menu
- **THEN** the native share sheet SHALL open (or the join link SHALL be copied to clipboard as fallback)

#### Scenario: Delete with confirmation
- **WHEN** user clicks Delete and confirms in the dialog
- **THEN** the session SHALL be deleted from Supabase (cascading to tapes, submissions, comments) and the session list SHALL refresh

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
