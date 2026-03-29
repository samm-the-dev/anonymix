## ADDED Requirements

### Requirement: Invite landing page
The join page at `/join/:sessionId` SHALL display: inviter name ("[name] invited you to join"), session name, session description, member avatars with count, up to 3 tape previews (title + prompt) with "+N more" overflow, and a "Join Session" button.

Reference: [02.1-invite-landing spec](_bmad-output/C-UX-Scenarios/02-the-casuals-first-session/02.1-invite-landing/02.1-invite-landing.md), [invite-landing.html prototype](_bmad-output/D-Prototypes/02-the-casuals-first-session-prototype/invite-landing.html)

#### Scenario: Join page displays session context
- **WHEN** an authenticated user visits `/join/:sessionId`
- **THEN** the page SHALL display the session name, description, admin name, member avatars, and tape previews

### Requirement: First-timer explainer
If the authenticated user has zero existing session memberships, the join page SHALL display an explainer section: "For each Tape you'll:" followed by bullet points explaining the submission, commenting, and reveal flow.

#### Scenario: Explainer shown for new users
- **WHEN** a user with no session memberships visits a join page
- **THEN** the explainer bullets SHALL be visible below the tape previews

#### Scenario: Explainer hidden for returning users
- **WHEN** a user with existing session memberships visits a join page
- **THEN** the explainer SHALL NOT be displayed

### Requirement: Join session action
Clicking "Join Session" SHALL insert a `session_players` record linking the current player to the session, then navigate to `/session/:sessionId`.

#### Scenario: Successful join
- **WHEN** user clicks "Join Session"
- **THEN** a membership record SHALL be created and the user SHALL be redirected to the session view

### Requirement: Existing member redirect
If the authenticated user is already a member of the session, the join page SHALL redirect immediately to `/session/:sessionId` without showing the join UI.

#### Scenario: Already a member
- **WHEN** a session member visits the join page
- **THEN** they SHALL be redirected to the session view

### Requirement: Theme toggle on join page
The join page SHALL include a theme toggle button in the top-right corner, matching the login page pattern.

#### Scenario: Toggle dark mode on join page
- **WHEN** user clicks the theme toggle on the join page
- **THEN** the theme SHALL switch between light and dark mode
