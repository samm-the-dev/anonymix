## Why

When a user selects Tidal as their Search service in the Listening section, tapping a song's search icon opens `https://listen.tidal.com/search?q=...` in a browser rather than launching the Tidal Android app. Tidal's App Links whitelist covers content paths (e.g. `/browse/track/{id}`) but not `/search`, so search links always fall through to the web player even when the app is installed.

Empirical testing (user's device) confirmed that `tidal://search?q=...` launches the installed Tidal Android app (`com.aspiro.tidal`) directly to the search results. Wrapping this in an Android `intent://` URL with a `browser_fallback_url` gives us app-launching behavior when Tidal is installed and graceful web fallback when it isn't.

## What Changes

- **Android + Tidal only**: when the runtime OS is Android and the selected service is Tidal, emit an `intent://` URL targeting `com.aspiro.tidal` with the `tidal://search?q={query}` payload and `S.browser_fallback_url` pointing to the existing `https://listen.tidal.com/search?q={query}` URL.
- **All other combinations unchanged**: iOS, desktop, and every non-Tidal platform keep the current `https://` search URL. No visible behavior change there.
- **OS detection**: small utility that reads `navigator.userAgent` to detect Android. No library — Android's UA string is stable enough for this check.
- **Call-site unchanged**: `buildSongSearchUrl(song, artist, 'tidal')` still returns a single string the existing `<a href>` consumes; the Android branching is internal to the URL builder.

## Non-goals

- iOS Tidal deep-linking — `tidal://` on iOS silently fails when the app isn't installed and there's no intent-URL-equivalent fallback mechanism. Web URL stays.
- Desktop Tidal deep-linking — the web player at `listen.tidal.com` is fully functional; no custom protocol handler work.
- Deep-linking for other platforms (Spotify, Apple Music, etc.) — each has its own scheme quirks; out of scope.
- Resolving song → Tidal track ID via the Tidal API for direct track deep-links — larger effort, requires API credentials and an edge function, deferred.
- Firefox Android `browser_fallback_url` handling — Firefox ignores the fallback hint; acceptable because Chrome/Samsung Internet cover the vast majority of PWA launches. No special-casing.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `playlist-export`: The per-song search link for Tidal SHALL use an Android `intent://` URL on Android devices, falling back to the existing `https://listen.tidal.com/search` URL on all other platforms.

## Impact

- **Modified files**: [src/hooks/musicPlatforms.ts](src/hooks/musicPlatforms.ts) — Tidal branch of `SEARCH_URL_BUILDERS` gains Android detection.
- **New files**: a small OS-detection utility (likely `src/lib/userAgent.ts`) with a unit test.
- **No API/dependency changes**, no migration, no env vars.
- **Testing**: unit tests for the URL builder (Android UA → intent URL, others → https URL). Real-device verification happens on the Vercel preview for this PR.
