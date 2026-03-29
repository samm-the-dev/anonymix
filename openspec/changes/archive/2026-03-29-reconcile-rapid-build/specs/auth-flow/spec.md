## ADDED Requirements

### Requirement: Magic link authentication
The system SHALL allow users to sign in via email magic link using Supabase Auth `signInWithOtp`. The magic link redirect URL SHALL include any pending path (e.g., `/join/:id`) so users return to their intended destination after authentication.

#### Scenario: Magic link sent successfully
- **WHEN** user enters a valid email and submits the login form
- **THEN** Supabase SHALL send a magic link email via Resend SMTP and the UI SHALL display a "Check your email" confirmation

#### Scenario: Pending path preserved through auth
- **WHEN** an unauthenticated user visits `/join/abc123`
- **THEN** the path SHALL be stored in localStorage and the magic link redirect URL SHALL include it
- **WHEN** the user clicks the magic link
- **THEN** they SHALL be redirected to `/join/abc123` after auth completes

### Requirement: Google OAuth authentication
The system SHALL allow users to sign in via Google OAuth using Supabase Auth `signInWithOAuth({ provider: 'google' })`. Google OAuth client SHALL be configured in Supabase Dashboard with GCloud credentials.

#### Scenario: Google sign-in redirect
- **WHEN** user clicks "Sign in with Google"
- **THEN** the browser SHALL redirect to Google's OAuth consent screen and return to the app after authorization

### Requirement: Spotify OAuth authentication
The system SHALL allow users to sign in via Spotify OAuth using Supabase Auth `signInWithOAuth({ provider: 'spotify' })`. Note: Spotify dev mode limits this to 5 allowlisted users.

#### Scenario: Spotify sign-in redirect
- **WHEN** user clicks "Sign in with Spotify"
- **THEN** the browser SHALL redirect to Spotify's OAuth consent screen and return to the app after authorization

### Requirement: Login page layout
The login page SHALL display, top to bottom: app title "Anonymix", subtitle "Choose how to sign in", Google OAuth button, Spotify OAuth button, "or" divider, inline email magic link input with send button, and footer text "Your platform determines where playlists are created." A theme toggle SHALL be present in the top-right corner.

Reference: [02.2-auth-sign-up spec](_bmad-output/C-UX-Scenarios/02-the-casuals-first-session/02.2-auth-sign-up/02.2-auth-sign-up.md), [auth-signup.html prototype](_bmad-output/D-Prototypes/02-the-casuals-first-session-prototype/auth-signup.html)

#### Scenario: Login page renders all elements
- **WHEN** an unauthenticated user visits the app
- **THEN** the login page SHALL display the Google button, Spotify button, divider, email input, and footer text

### Requirement: Auth state management
The `useAuth` hook SHALL manage auth state including: current Supabase user, player profile, loading state, and `needsProfile` flag. It SHALL listen to `onAuthStateChange` and fetch the player record when authenticated.

#### Scenario: New user needs profile
- **WHEN** a user authenticates for the first time (no player record exists)
- **THEN** `needsProfile` SHALL be `true` and the app SHALL render the profile setup page

#### Scenario: Returning user
- **WHEN** a user authenticates with an existing player record
- **THEN** the player profile SHALL be loaded and the app SHALL render the main routes

### Requirement: Auth-gated routing
Unauthenticated users SHALL see only the login page (plus public routes `/privacy`, `/terms`). Users without a player profile SHALL see the profile setup page. Fully authenticated users SHALL see the main app routes.

#### Scenario: Public routes accessible without auth
- **WHEN** any user visits `/privacy` or `/terms`
- **THEN** the page SHALL render without requiring authentication
