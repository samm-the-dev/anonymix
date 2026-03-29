## 1. Schema & Types

- [x] 1.1 Create Supabase migration adding `musicbrainz_id` (text, nullable), `release_id` (text, nullable), `cover_art_url` (text, nullable) to submissions table
- [x] 1.2 Update `database.types.ts` with new submission columns
- [x] 1.3 Push migration to Supabase

## 2. Song Search — Return Release ID

- [ ] 2.1 Update `SongResult` interface in `useSongSearch.ts` to include `releaseId` (optional string)
- [ ] 2.2 Parse `releases[0].id` from MusicBrainz response and include in results

## 3. Album Art at Submission Time

- [ ] 3.1 Create `src/lib/coverArt.ts` utility: `fetchCoverArtUrl(releaseId: string): Promise<string | null>` — fetches from `https://coverartarchive.org/release/{id}/front-250`, returns the redirect URL or null on 404
- [ ] 3.2 Update song preview in search overlay (SessionViewPage) to show real album art when available — replace gray placeholder with `<img>` when `coverArtUrl` is resolved
- [ ] 3.3 Resolve cover art URL when user selects a search result (before submission)

## 4. Store IDs with Submission

- [ ] 4.1 Update submission handler in SessionViewPage to include `musicbrainz_id`, `release_id`, `cover_art_url` when submitting from search results (null for manual entries)
- [ ] 4.2 Update `SubmissionData` interface to include new fields

## 5. Playlist View — Album Art

- [ ] 5.1 Update playlist song cards to show album art thumbnail (40x40 rounded) when `cover_art_url` is available

## 6. Odesli Song Links

- [ ] 6.1 Create `src/hooks/useOdesliLinks.ts` — accepts array of `{ id: string, musicbrainzId: string | null }`, resolves sequentially with 200ms delay, returns `Map<string, string>` of submission ID → song.link URL
- [ ] 6.2 Call `useOdesliLinks` in SessionViewPage when tape is playlist_ready/results
- [ ] 6.3 Add "Open" button (ExternalLink icon) to playlist song cards when song.link URL is available — opens in new tab

## 7. Fix Submission Header Redundancy

- [ ] 7.1 Already fixed — session name in header, tape title only in prompt section

## 8. Verify & Commit

- [ ] 8.1 Type check, test submission with album art, test playlist with Open links
- [ ] 8.2 Run db:advisors after migration push
- [ ] 8.3 Commit all changes
