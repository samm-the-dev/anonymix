## ADDED Requirements

### Requirement: Profile setup on first login
When a user authenticates for the first time (no player record), the app SHALL display a profile setup page with: avatar preview, display name input (max 20 chars), emoji avatar picker (12 music emoji options), color picker (8 color options), and a "Continue" button.

Reference: [02.3-profile-account spec](_bmad-output/C-UX-Scenarios/02-the-casuals-first-session/02.3-profile-account/02.3-profile-account.md), [profile.html prototype](_bmad-output/D-Prototypes/00-global-prototype/profile.html)

#### Scenario: Profile setup creates player record
- **WHEN** user fills in name, picks avatar and color, and clicks Continue
- **THEN** a player record SHALL be inserted into the `players` table with `auth_id` linking to the Supabase auth user

### Requirement: Profile editing
The profile page SHALL display the current avatar, name, email, and an "Edit profile" link. Editing mode SHALL show the same emoji/color pickers as setup, with Save and Cancel buttons. Changes SHALL update the `players` table via `useAuth.updatePlayer`.

#### Scenario: User changes avatar
- **WHEN** user enters edit mode, selects a different emoji, and clicks Save
- **THEN** the player record SHALL be updated and the new avatar SHALL reflect immediately in the bottom nav

### Requirement: Profile page sign-out
The profile page SHALL include a "Sign out" button that calls `supabase.auth.signOut()` and returns the user to the login page.

#### Scenario: Sign out clears auth state
- **WHEN** user clicks Sign out
- **THEN** the Supabase session SHALL be cleared and the app SHALL render the login page

### Requirement: Bottom nav profile link
The bottom navigation bar SHALL show the user's emoji avatar and display name as the profile link, navigating to `/profile`.

#### Scenario: Bottom nav shows current avatar
- **WHEN** the user is authenticated with a player profile
- **THEN** the bottom nav profile link SHALL display their emoji avatar and name
