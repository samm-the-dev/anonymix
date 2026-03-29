## Context

Anonymix was rapidly built over two sessions, pivoting from Convex to Supabase and implementing auth through submission without OpenSpec tracking. The app is functional — users can sign up, create sessions with tapes, share invite links, join, and submit songs. However, the implementation diverged from the validated prototypes in several places, and three existing specs reference the abandoned Convex backend.

This design covers how to reconcile the codebase with the design artifacts and update specs to reflect reality.

### Current architecture

- **Frontend**: React 19 + Vite 7 + TypeScript, Tailwind 4 with CSS variable theming
- **Backend**: Supabase Cloud (Postgres + Auth + Realtime)
- **Auth**: Supabase Auth with magic link (primary), Google OAuth, Spotify OAuth (5-user dev cap)
- **Song search**: MusicBrainz API (free, no auth, 1 req/sec)
- **Playlist export**: Copy-paste to Tune My Music (manual handoff)
- **Migrations**: Supabase CLI, 7 migrations applied to production
- **RLS**: Per-table policies — member-only for session data, open read for invite previews and player profiles

## Goals / Non-Goals

**Goals:**
- Update existing specs (`session-data-model`, `app-scaffold`, `session-home-page`) to match Supabase reality
- Create specs for all features built during rapid implementation
- Document known gaps between implementation and prototypes
- Produce a task list of alignment fixes (prototype fidelity, missing interactions)

**Non-Goals:**
- Building commenting or reveal flows (separate changes)
- Session admin/edit features (UX scenario 04 — separate change)
- Rewriting working code that doesn't match prototypes pixel-perfectly — focus on interaction and behavior gaps
- Platform deep-linking for playlist (design decision: Tune My Music copy-paste is the current approach)

## Decisions

### 1. Spec updates vs. new specs for modified capabilities

**Decision**: Update existing spec files in-place with delta sections, rather than creating new specs.

**Why**: The `session-data-model`, `app-scaffold`, and `session-home-page` specs describe the same capabilities — the backend and schema just changed from Convex to Supabase. Creating new specs would duplicate intent. Delta sections clearly mark what changed.

**Alternative considered**: Delete old specs and write new ones. Rejected because the requirement-level behavior (session cards, data model shape) is mostly unchanged — only the implementation layer shifted.

### 2. Gap categorization: fix now vs. accept vs. defer

**Decision**: Categorize each prototype gap as:
- **Fix**: Interaction behavior that's broken or missing (action button navigation, search auto-open)
- **Accept**: Conscious design pivots (Tune My Music instead of platform deep-links, MusicBrainz instead of Spotify search)
- **Defer**: Nice-to-have polish (album art preview, last-to-submit animation, submission progress bar)

**Why**: Avoids scope creep while ensuring core interaction design matches prototypes.

### 3. Auth architecture deviation from prototype

**Decision**: Accept the current auth architecture (magic link + OAuth providers) as an improvement over the prototype's platform-only auth (Spotify/YouTube buttons).

**Why**: The prototype assumed Spotify OAuth would be the primary login. Spotify's 5-user dev mode cap made that impractical. Magic link is zero-friction and unlimited. Google OAuth adds a familiar option. This is a deliberate improvement, not a regression.

### 4. MusicBrainz for search instead of Spotify/YouTube catalog

**Decision**: Accept MusicBrainz as the song search provider.

**Why**: Spotify Web API requires Premium + has a 5-user dev mode cap. YouTube Music has no public search API. MusicBrainz is free, no auth, and has comprehensive music metadata. The prototype's cross-platform availability indicators (grayed-out unavailable songs) are deferred since we don't have per-platform catalog access.

## Risks / Trade-offs

- **MusicBrainz search quality** → May not match Spotify's fuzzy search UX. Mitigation: manual entry fallback exists.
- **Tune My Music dependency** → Third-party service we don't control. Mitigation: Odesli API is a backup for per-song links; export is just a text list that works anywhere.
- **Spec drift** → Specs could drift again during future rapid builds. Mitigation: Add a note to CLAUDE.md requiring OpenSpec proposals for new features.
- **Existing specs reference Convex** → Developers reading specs will see outdated backend references. Mitigation: Delta specs clearly mark the pivot.

## Open Questions

- Should the Spotify login button be removed from the login page given the 5-user cap, or kept for the dev/test group?
- Should we add a CLAUDE.md rule requiring OpenSpec proposals before building new features?
