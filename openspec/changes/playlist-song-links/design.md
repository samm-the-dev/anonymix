## Context

Two external APIs are used:

1. **MusicBrainz Cover Art Archive** (`https://coverartarchive.org/release/{id}/front-250`) — returns album cover image given a MusicBrainz release ID. Free, no auth, no hard rate limit.

2. **Odesli API** (`https://api.song.link/v1-alpha.1/links?url={musicbrainz-url}`) — given a MusicBrainz recording URL, returns cross-platform links including a universal `pageUrl` (song.link page). Free, no auth, 10 req/min.

Current state: playlist view shows song cards with name + artist and a gray placeholder for art. Submission stores `song_name` and `artist_name` only — no platform IDs or art URLs.

## Goals / Non-Goals

**Goals:**
- Each song in the playlist view has an "Open" button linking to its song.link page
- Lookups happen client-side when playlist view loads
- Rate limit respected (stagger requests)
- Graceful degradation when lookup fails

**Non-Goals:**
- Caching in Supabase — keep it client-side only for now
- Showing per-platform icons (Spotify, YouTube, etc.) — just a universal "Open" link
- Resolving links during submission — only on playlist view

## Decisions

### 1. Lookup strategy: search by "Artist Song" text query

**Decision**: Use the Odesli API's text search — construct a query from `artist_name + " " + song_name` and search MusicBrainz-style. The API also accepts platform URLs, but since we don't store platform-specific IDs from MusicBrainz, text search is our only option.

**Alternative considered**: Store a MusicBrainz recording ID during submission and use it for lookup. Rejected — adds schema complexity, and text search works well enough for popular songs.

**Caveat**: Odesli's API primary use case is URL-to-URL conversion, not text search. We may need to construct a MusicBrainz URL from the recording ID we already get from search results, then pass that to Odesli.

### 2. Better approach: use MusicBrainz recording ID

**Decision (revised)**: During submission, we already get a MusicBrainz recording ID from the search. Store it in the submissions table. Then construct `https://musicbrainz.org/recording/{id}` and pass it to Odesli as the `url` parameter. This is more reliable than text search.

**Migration**: Add `musicbrainz_id` column to submissions (nullable, for backward compat with existing submissions).

### 3. Rate limiting: sequential with delay

**Decision**: When the playlist view loads, resolve songs sequentially with a 200ms delay between requests (300 req/min theoretical, well within 10/min limit even at 6 req/min pace). Cache results in component state — no re-fetching on re-renders.

### 4. UI: subtle external link icon

**Decision**: Add a small `ExternalLink` icon button on each song card. Opens in new tab. Only visible when a song.link URL has been resolved. While resolving, show nothing (not a loading spinner — too noisy for a list).

## Risks / Trade-offs

- **Odesli text search reliability** → May not find obscure songs. Mitigation: MusicBrainz ID approach is more reliable; fallback to no link (copy-paste still works).
- **10 req/min rate limit** → A playlist with 10+ songs could hit the limit. Mitigation: sequential with delays; most friend-group sessions have 5-8 players.
- **Odesli API stability** → Free service, no SLA. Mitigation: graceful fallback — missing links don't break the UI.

## Open Questions

- Should we store the resolved song.link URL in Supabase to avoid re-resolving? Probably not for MVP — adds complexity for a cached value.
