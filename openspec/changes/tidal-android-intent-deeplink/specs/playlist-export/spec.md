## ADDED Requirements

### Requirement: Tidal search launches Android app when installed
When the runtime platform is Android and the user has selected Tidal as their search service, the per-song search link SHALL use an Android `intent://` URL that launches the Tidal app (`com.aspiro.tidal`) at the search results screen for the song query.

The intent URL SHALL:
1. Target the path `search?q={query}` under the `tidal` scheme
2. Specify `package=com.aspiro.tidal` so Android routes directly to the Tidal app
3. Include `S.browser_fallback_url` pointing at `https://listen.tidal.com/search?q={query}` for browsers that support fallback (Chrome, Samsung Internet)

#### Scenario: Tidal app installed on Android, user taps search icon
- **WHEN** an Android user with the Tidal app installed selects Tidal as their search service and taps the search icon for a song
- **THEN** the Tidal app SHALL launch to the search results screen for that song's query

#### Scenario: Web fallback when Tidal app unavailable
- **WHEN** an Android user without the Tidal app installed (or with "Open supported links" disabled) taps the Tidal search icon in Chrome or Samsung Internet
- **THEN** the browser SHALL follow the `S.browser_fallback_url` to `https://listen.tidal.com/search?q={query}` and open the Tidal web player

### Requirement: Non-Android platforms unchanged
When the runtime platform is not Android, the per-song Tidal search link SHALL continue to be `https://listen.tidal.com/search?q={query}` with no intent-URL wrapping.

#### Scenario: iOS user taps Tidal search
- **WHEN** an iOS user taps the Tidal search icon for a song
- **THEN** the link SHALL resolve to `https://listen.tidal.com/search?q={query}` (unchanged from prior behavior)

#### Scenario: Desktop user taps Tidal search
- **WHEN** a desktop user taps the Tidal search icon for a song
- **THEN** the link SHALL resolve to `https://listen.tidal.com/search?q={query}` and open the Tidal web player in a new tab (unchanged from prior behavior)
