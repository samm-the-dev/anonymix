## 1. OS detection utility

- [ ] 1.1 Create `src/lib/userAgent.ts` exporting `isAndroid()` that returns `/Android/i.test(navigator.userAgent)` with a `typeof navigator` guard (design: decision 1)
- [ ] 1.2 Add `src/lib/userAgent.test.ts` covering Android UA, iOS UA, desktop UA, and missing-navigator cases (design: decision 1)

## 2. Tidal Android intent URL in search URL builder

- [ ] 2.1 Update `SEARCH_URL_BUILDERS.tidal` in `src/hooks/musicPlatforms.ts` to emit the `intent://search?q=...#Intent;scheme=tidal;package=com.aspiro.tidal;S.browser_fallback_url=...;end` URL when `isAndroid()` is true, and keep `https://listen.tidal.com/search?q=...` otherwise (spec: Tidal search launches Android app when installed)
- [ ] 2.2 Add a code comment on the Tidal builder documenting the confirmed scheme path (`tidal://search?q=`) and the Chrome/Samsung Internet fallback behavior so future maintainers can re-verify (design: Risks — scheme path drift)
- [ ] 2.3 Add `src/hooks/musicPlatforms.test.ts` covering the Android branch (correct intent URL shape, correct fallback encoding) and the non-Android branch (unchanged https URL), plus a sanity check that other platforms are unaffected by the UA (design: decision 4)

## 3. Call-site verification

- [ ] 3.1 Confirm the Listening section's search links render the builder output directly in an `<a href>` (or `window.open`) without altering the URL (design: decision 2)
- [ ] 3.2 If the anchor uses `target="_blank"` and device testing in step 4 shows intent URLs are blocked, add a conditional `target` that switches to same-tab for `intent://` URLs (design: decision 3)

## 4. Device verification on Vercel preview

- [ ] 4.1 Open draft PR; wait for Vercel preview URL
- [ ] 4.2 Install the PWA from the preview URL on an Android device with Tidal installed; select Tidal as search service; tap a song's search icon; verify the Tidal app launches on the search results screen (spec: Tidal search launches Android app when installed)
- [ ] 4.3 Repeat with Tidal uninstalled (or simulate by clearing the "Open supported links" toggle); verify the browser falls back to `listen.tidal.com/search?q=...` (spec: Web fallback when Tidal app unavailable)
- [ ] 4.4 Smoke-test Tidal search on a non-Android device (iOS or desktop) to confirm no regression (spec: Non-Android platforms unchanged)
