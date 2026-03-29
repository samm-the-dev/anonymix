## ADDED Requirements

### Requirement: Web app manifest
The app SHALL have a valid web app manifest with app name, icons, theme color, background color, and `display: standalone`. The manifest SHALL reference existing icons at `public/icons/`.

#### Scenario: Manifest present
- **WHEN** a browser requests the manifest
- **THEN** it SHALL return valid JSON with name "Anonymix", start_url "/", display "standalone", and icon references

### Requirement: Service worker
The app SHALL register a service worker that precaches app shell assets and caches runtime resources (album art, API responses). The service worker SHALL auto-update without user intervention.

#### Scenario: Service worker registered
- **WHEN** the app loads in a supported browser
- **THEN** a service worker SHALL be registered and active

### Requirement: Install prompt
A dismissible install banner SHALL appear on the session home page after the user has completed at least one tape action (submission or comment). The banner SHALL not appear if the app is already installed or if the user has previously dismissed it.

#### Scenario: First-time eligible user sees prompt
- **WHEN** user has submitted a song and visits the home page
- **THEN** an install banner SHALL appear at the bottom of the page

#### Scenario: User dismisses prompt
- **WHEN** user dismisses the install banner
- **THEN** the banner SHALL not appear again (tracked in localStorage)

#### Scenario: Already installed
- **WHEN** the app is running in standalone mode
- **THEN** the install banner SHALL not appear

### Requirement: Offline indicator
A banner SHALL appear below the app bar when the device loses network connectivity, displaying "You're offline". The banner SHALL disappear when connectivity is restored.

#### Scenario: Going offline
- **WHEN** the device loses network connectivity
- **THEN** a "You're offline" banner SHALL appear below the app bar

#### Scenario: Coming back online
- **WHEN** the device regains connectivity
- **THEN** the offline banner SHALL disappear
