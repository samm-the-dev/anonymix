## 1. Spec Archival — Update Existing Specs

- [x] 1.1 Archive delta specs into `openspec/specs/session-data-model/spec.md` (remove Convex references, add Supabase schema with RLS) — ref: `specs/session-data-model/spec.md`
- [x] 1.2 Archive delta specs into `openspec/specs/app-scaffold/spec.md` (remove Convex, add Supabase CLI, gen scripts, advisor hook) — ref: `specs/app-scaffold/spec.md`
- [x] 1.3 Archive delta specs into `openspec/specs/session-home-page/spec.md` (add dots menu, bottom nav, new session button, action deep-links) — ref: `specs/session-home-page/spec.md`

## 2. Spec Archival — New Capability Specs

- [x] 2.1 Copy `specs/auth-flow/spec.md` to `openspec/specs/auth-flow/spec.md`
- [x] 2.2 Copy `specs/player-profile/spec.md` to `openspec/specs/player-profile/spec.md`
- [x] 2.3 Copy `specs/create-session/spec.md` to `openspec/specs/create-session/spec.md`
- [x] 2.4 Copy `specs/join-session/spec.md` to `openspec/specs/join-session/spec.md`
- [x] 2.5 Copy `specs/session-view/spec.md` to `openspec/specs/session-view/spec.md`
- [x] 2.6 Copy `specs/song-submission/spec.md` to `openspec/specs/song-submission/spec.md`
- [x] 2.7 Copy `specs/playlist-export/spec.md` to `openspec/specs/playlist-export/spec.md`
- [x] 2.8 Copy `specs/blueprint-import-export/spec.md` to `openspec/specs/blueprint-import-export/spec.md`

## 3. Prototype Alignment Fixes — Session View

- [x] 3.1 Match prototype session-view.html tape card layout: cassette aspect ratio (~335w x 260h), state-specific card content per phase — ref: `specs/session-view/spec.md`, prototype `01-the-enthusiasts-round-prototype/session-view.html`
- [x] 3.2 Add submission progress indicator on submitting tape card (X of Y submitted) — ref: prototype session-view.html
- [x] 3.3 Ensure action buttons from session home deep-link correctly: Submit opens search, Comment will open comment flow, Listen/Results navigate to tape — ref: `specs/session-home-page/spec.md`

## 4. Prototype Alignment Fixes — Tape Submission

- [x] 4.1 Match prototype tape-submission.html layout: prompt display at top with deadline countdown, search input positioning — ref: `specs/song-submission/spec.md`, prototype `01-the-enthusiasts-round-prototype/tape-submission.html`
- [ ] 4.2 Add optional context note textarea below song selection (prototype has this, implementation doesn't) — ref: prototype tape-submission.html — DEFERRED: nice-to-have polish
- [x] 4.3 Add success toast notification after submission — ref: prototype tape-submission.html

## 5. Prototype Alignment Fixes — Session Home

- [x] 5.1 Verify session card layout matches prototype: title + dots menu, description, avatars, tape info, action row — ref: `specs/session-home-page/spec.md`, prototype `01-the-enthusiasts-round-prototype/session-home.html` — VERIFIED: layout matches
- [x] 5.2 Verify deadline formatting matches prototype patterns (due today/tomorrow/in N days, completed N days ago) — ref: prototype session-home.html — VERIFIED: formatDeadline.ts matches all patterns

## 6. Prototype Alignment Fixes — Auth & Profile

- [x] 6.1 Compare login page layout with prototype auth-signup.html — VERIFIED: accepted deviation (Google+Spotify+magic link vs platform-only buttons). Structure matches prototype intent.
- [x] 6.2 Compare profile page with prototype profile.html — VERIFIED: view mode + edit mode with emoji/color pickers matches prototype.

## 7. Prototype Alignment Fixes — Join Session

- [x] 7.1 Compare join page with prototype invite-landing.html — VERIFIED: layout matches (session name, admin, avatars, tape previews, explainer). Accepted deviation: auth-first flow means join page shows "Join Session" button instead of platform auth buttons.

## 8. Process Alignment

- [x] 8.1 Add CLAUDE.md rule requiring OpenSpec proposals before building new features
- [x] 8.2 Remove `SessionStubPage.tsx` (replaced by `SessionViewPage.tsx`)
- [ ] 8.3 Commit all spec changes and alignment fixes
