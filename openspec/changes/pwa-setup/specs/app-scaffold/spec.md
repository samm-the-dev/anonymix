## MODIFIED Requirements

### Requirement: PWA meta tags
The app's `index.html` SHALL include PWA-related meta tags: `theme-color`, `apple-mobile-web-app-capable`, and link to the web manifest.

#### Scenario: Meta tags present
- **WHEN** the HTML document loads
- **THEN** it SHALL contain theme-color meta tag and manifest link

### Requirement: Service worker registration
The app SHALL register the service worker on initial load via the `vite-plugin-pwa` virtual module.

#### Scenario: SW registered on load
- **WHEN** the app's main entry point executes
- **THEN** the service worker SHALL be registered
