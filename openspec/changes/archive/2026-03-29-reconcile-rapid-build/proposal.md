## Why

During rapid prototyping, we built auth, create/join sessions, profile, and song submission without going through OpenSpec. The implementation works but has drifted from the validated prototypes and UX scenarios. Existing specs reference Convex (pre-pivot backend) and don't cover the features built. This change reconciles what was built, documents gaps against the design artifacts, and creates a tracked path to complete the core tape round cycle.

## Non-goals

- Rewriting working features from scratch — this is alignment, not a redo
- Changing the UX scenarios or prototypes — those remain the source of truth
- Building new features — remaining work (commenting, reveal) will be separate changes

## What Changes

**Already built (needs spec coverage):**
- Magic link + Google OAuth + Spotify OAuth authentication (UX scenario 02.2)
- Profile setup and editing with emoji/color picker (UX scenario 02.3, prototype 00-global)
- Session creation with crate-flip tape editor, timing, import/export (UX scenario 03.1, prototype 03)
- Invite landing and join flow with first-timer explainer (UX scenario 02.1, prototype 02)
- Session home with cards, dots menu (invite/export/delete), collapsible sections (UX scenario 01.1, prototype 01)
- Session view with crate-flip tape navigation (UX scenario 01.2, prototype 01)
- Song submission with MusicBrainz autocomplete (UX scenario 01.3, prototype 01)
- Playlist copy for Tune My Music (partial 01.4 — no platform deep-links)
- Bottom nav (Sessions + Profile)
- Supabase backend with RLS, migrations, realtime subscriptions
- Blueprint export/import (not in original design — emergent feature)

**Known gaps vs. prototypes:**
- Session view doesn't match prototype card layout (submission progress bar, platform-specific "Open in" buttons missing)
- Tape submission missing: album art preview, cross-platform availability indicators, last-to-submit animation, context note field
- Session home action buttons should deep-link to specific actions (partially done with `?action=` params)
- Playlist ready state is copy-paste to Tune My Music instead of platform deep-links (design decision, not a gap)
- No commenting flow yet (UX scenario 01.5, prototype tape-voting.html)
- No reveal flow yet (UX scenario 01.6, prototype tape-reveal.html)
- No session admin/edit flow (UX scenario 04.1, prototype 04)

**Existing specs to update:**
- `session-data-model` references Convex — needs update to Supabase/Postgres
- `app-scaffold` references Convex — needs update to Supabase
- `session-home-page` is mostly accurate but missing dots menu, bottom nav, new session button

## Capabilities

### New Capabilities
- `auth-flow`: Magic link, Google OAuth, Spotify OAuth login, pending path preservation through auth
- `player-profile`: Profile setup (first login), profile editing (avatar, color, name), profile page with sign-out
- `create-session`: Session creation with crate-flip tape editor, timing steppers, celebration with invite link
- `join-session`: Invite landing page, first-timer explainer, membership check, auto-redirect for existing members
- `session-view`: Crate-flip tape navigation, tape status display, per-tape content areas
- `song-submission`: MusicBrainz autocomplete search, manual entry fallback, submission CRUD
- `playlist-export`: Copy-to-clipboard formatted text for Tune My Music, per-song display
- `blueprint-import-export`: Session blueprint JSON export from dots menu, import in create flow with additive/overwrite options

### Modified Capabilities
- `session-data-model`: Backend changed from Convex to Supabase. Schema uses Postgres with RLS policies, auth_id on players, cascade deletes. Submissions now include artist_name.
- `app-scaffold`: Backend changed from Convex to Supabase. Auth via Supabase Auth. Supabase CLI for migrations. New scripts (db:push, db:advisors, gen:icons, gen:og).
- `session-home-page`: Added dots menu (invite/export/delete), "New Session" button, bottom nav bar, action buttons navigate with query params.

## Impact

- **Supabase migrations**: 6 migrations already applied to production (init, add_auth, fix_advisor_warnings, invite_rls, delete_session_rls, fix_invite_player_read, add_artist_to_submissions)
- **Routes**: `/`, `/create`, `/join/:id`, `/session/:id`, `/profile`, `/privacy`, `/terms`
- **Dependencies added**: @supabase/supabase-js, supabase CLI (dev)
- **External services**: Supabase Cloud, Resend (SMTP), MusicBrainz API, Porkbun (domain)
- **Files affected**: ~15 new source files (pages, hooks, contexts, lib), 3 migration files, favicon/icon assets
