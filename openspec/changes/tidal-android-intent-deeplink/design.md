## Context

The Listening section of a tape (when `tab === 'links'` and a service is selected) renders per-song search buttons. Each button's URL comes from [buildSongSearchUrl](src/hooks/musicPlatforms.ts) which dispatches on platform via the `SEARCH_URL_BUILDERS` map. Today the Tidal entry is:

```ts
tidal: (q) => `https://listen.tidal.com/search?q=${encodeURIComponent(q)}`,
```

The Tidal Android app (`com.aspiro.tidal`) verifies `listen.tidal.com` as an App Link target, but only content paths (`/browse/track/{id}`, `/browse/album/{id}`, etc.) are claimed. `/search` is not, so the URL always opens in the browser even with the app installed and "Open supported links" enabled.

The user confirmed via manual testing in Chrome on Android that the following scheme launches the installed Tidal app to search results:

- `tidal://search?q=<query>` ✓
- `tidal://search/<query>` ✓ (slash form also works)
- `tidal://browse/search?q=<query>` ✗

We'll standardize on the query-param form (`tidal://search?q=...`) because it matches the web URL structure and is trivially URL-encodable.

## Goals / Non-Goals

**Goals:**
- Android users with Tidal installed land in the app at search results instead of the web player
- Android users without Tidal installed still get a working web search via the browser fallback
- iOS / desktop / non-Tidal paths are byte-for-byte unchanged
- Call-site in `ListeningSection` doesn't need to know about the Android branching

**Non-Goals:**
- iOS `tidal://` deep-linking (no fallback mechanism — worse UX than web)
- Desktop protocol handler
- Direct track-ID deep links via Tidal API
- Cross-browser fallback handling on Android (Firefox Android ignores `S.browser_fallback_url`; acceptable)
- Generalizing platform → intent URL across other services

## Decisions

### 1. Android detection via `navigator.userAgent`

Use a single-line UA check: `/Android/i.test(navigator.userAgent)`. No UA-parsing library, no `navigator.userAgentData` (patchy browser support). Android's UA string reliably contains "Android" in every mainstream browser including Chrome, Samsung Internet, Firefox, Edge, and all WebViews/PWAs.

Placement: new `src/lib/userAgent.ts` exposing `isAndroid()` so it's reusable and testable. Mock-friendly via `navigator.userAgent` override in Vitest.

SSR isn't a concern (this is a Vite SPA), but guard against missing `navigator` anyway for unit-test robustness.

### 2. Intent URL construction inside `SEARCH_URL_BUILDERS.tidal`

Keep the call site (`buildSongSearchUrl`) unchanged. The Tidal entry becomes:

```ts
tidal: (q) => {
  const encoded = encodeURIComponent(q);
  const webUrl = `https://listen.tidal.com/search?q=${encoded}`;
  if (!isAndroid()) return webUrl;
  return `intent://search?q=${encoded}#Intent;scheme=tidal;package=com.aspiro.tidal;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
},
```

**Why inline, not a separate `buildTidalAndroidIntent` helper:** the logic is three lines and only used here. A helper would be premature abstraction.

**Encoding note:** the fallback URL is embedded inside the intent URL's extras, so it gets URL-encoded once on top of the encoding already inside it. That double-encoding is correct per the Android intent URL spec — Chrome decodes `S.browser_fallback_url` once before using it.

### 3. Click target: keep using `<a href>` / `window.open`

The existing ListeningSection renders search links as anchors with `target="_blank"` (verify during implementation). `intent://` URLs don't work in `target="_blank"` on all Android browsers — some block the navigation for security. Need to verify behavior during device testing; if `_blank` blocks it, switch to same-tab navigation for the Tidal Android case. This is a deferred decision pending the Vercel preview test.

If `_blank` turns out to block intent URLs, the cleanest fix is to change the anchor's `target` conditionally when the URL starts with `intent://`.

### 4. Testing strategy

- **Unit tests** (Vitest): mock `navigator.userAgent` with Android vs. iOS vs. desktop strings and assert the emitted URL shape for Tidal. Also assert that non-Tidal platforms are unaffected by the UA.
- **Manual device test** (Vercel preview): on a real Android device, open the PWA, select Tidal, tap a search icon. Expected: Tidal app launches on the search screen. Repeat with Tidal uninstalled (or test in incognito): expected to fall back to the web player.
- **No E2E test**: Playwright can't verify native app launching.

## Risks / Trade-offs

- **Intent URL + `target="_blank"`**: unverified; may need a conditional target (see Decision 3). Low risk — easy to fix once observed on device.
- **Firefox Android**: does not honor `S.browser_fallback_url`. Users on Firefox without Tidal installed will see the intent URL fail to navigate. Acceptable: Firefox mobile share is small, and Chrome is the default PWA launcher. If it becomes an issue, we can detect Firefox UA and fall through to the web URL.
- **Scheme path drift**: if Tidal ever changes `tidal://search?q=` to a different path, our deep link silently degrades (app opens to home or errors). Mitigation: the user's device test on the PR is our canary. We'll document the confirmed scheme in a code comment on the Tidal builder so future maintainers can re-verify.
- **Double-encoding bugs**: easy to get wrong by hand; unit test covers this.
- **PWA vs. browser behavior**: the user flagged that intent URLs sometimes work differently when launched from a PWA home-screen launcher vs. Chrome's address bar. Real-device test on the Vercel preview (which serves the prod build with PWA manifest) is the authoritative check.
