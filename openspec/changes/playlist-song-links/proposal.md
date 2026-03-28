## Why

The playlist view currently shows song names with a bulk copy-paste option for Tune My Music. Users can't open individual songs to listen. The prototype calls for per-song platform links — we can't do platform-specific deep-links (Spotify API restrictions), but Odesli (song.link) provides cross-platform universal links that let each user open in their own platform. This gets us the "go listen" UX without any platform OAuth.

Reference: [01.4-tape-playlist-ready spec](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.4-tape-playlist-ready/01.4-tape-playlist-ready.md)

## Non-goals

- Platform-specific deep-links (Spotify/YouTube Music native playlist creation)
- Storing Odesli data permanently — it's a lookup cache, not a data model change
- Changing the tape card's "Copy playlist" button in the crate — that stays as-is

## What Changes

- **Album art at submission time**: Fetch cover art from MusicBrainz Cover Art Archive when user submits a song. Store thumbnail URL and MusicBrainz recording/release IDs with the submission.
- **Album art in UI**: Show album art in the submission search preview (replacing gray placeholder) and on playlist song cards.
- **Per-song "Open" button**: Each song in the playlist view gets an external link button that opens its song.link page (auto-detects user's platform)
- **Odesli lookup at playlist time**: Resolve each submission's MusicBrainz ID to a song.link URL via the Odesli API, with client-side caching
- **Graceful fallback**: If Cover Art Archive or Odesli can't resolve, show no art / no link — manual entries still work via copy-paste
- **Rate limiting**: Odesli allows 10 req/min without an API key. Cover Art Archive has no rate limit but requests are staggered

## Capabilities

### New Capabilities
- `odesli-song-links`: Hook and UI for resolving submissions to cross-platform song.link URLs via Odesli API
- `album-art`: Fetch and store album art from Cover Art Archive at submission time; display in search preview and playlist cards

### Modified Capabilities
- `playlist-export`: Playlist song list cards gain album art and per-song "Open" buttons when available. Replaces the "no per-song platform buttons" deviation with Odesli universal links.
- `song-submission`: Store MusicBrainz recording ID, release ID, and cover art URL alongside submission. Search preview shows real album art.

## Impact

- **New files**: `src/hooks/useOdesliLinks.ts`, album art fetch utility
- **Modified files**: `SessionViewPage.tsx` (playlist cards + Open buttons), `useSongSearch.ts` (return release ID), submission handler (store IDs + art URL)
- **Migration**: Add `musicbrainz_id`, `release_id`, `cover_art_url` columns to submissions table
- **External dependencies**: Odesli API (free, no auth, 10 req/min), MusicBrainz Cover Art Archive (free, no auth)
