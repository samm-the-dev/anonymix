## ADDED Requirements

### Requirement: Members bottom sheet
The session view SHALL include a bottom sheet overlay showing all session members. The sheet SHALL slide up from the bottom with a backdrop, contain a "Members" header with "Done" button, member list with avatars and names, and a "Copy invite link" button.

Reference: [session-admin.html prototype](_bmad-output/D-Prototypes/04-the-hosts-session-edits-prototype/session-admin.html) — members sheet pattern.

#### Scenario: Open members sheet
- **WHEN** user taps the Users icon in the session view header
- **THEN** a bottom sheet SHALL slide up showing all session members with their emoji avatars, avatar colors, and display names

#### Scenario: Copy invite link from sheet
- **WHEN** user taps "Copy invite link" in the members sheet
- **THEN** the join URL for the session SHALL be copied to the clipboard

#### Scenario: Close members sheet
- **WHEN** user taps "Done" or the backdrop
- **THEN** the sheet SHALL slide down and close

### Requirement: Members icon in session header
The session view header SHALL display a Users icon button on the right side, balanced with the back button on the left. The session title SHALL remain centered via absolute positioning.

#### Scenario: Header layout balance
- **WHEN** the session view renders
- **THEN** the back button SHALL be on the left (w-8), title centered absolutely, and Users icon on the right (w-8)
