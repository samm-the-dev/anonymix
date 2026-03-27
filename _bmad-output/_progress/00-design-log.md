# Design Log — Anonymix

## Current Phase
Phase 4: UX Design — **IN PROGRESS**

## Current

(empty)

## Phase 4 Summary

**Discussion complete** for all 4 scenarios (10 pages + 1 shared).
**3 pages eliminated** during design (Song Search, Platform Link, Profile from onboarding).
**3 core views wireframed:** Session Home, Session View (tape crate), Tape Submission.
**Remaining pages** are simple or reuse established patterns — specs sufficient for implementation.

**Key patterns established:**
- Tape card as evolving container (submit → playlist → vote → reveal)
- Crate-flip interaction reused across browse, create, edit
- Session view is the hub — most "pages" are card states or modes
- Admin is permissions on existing views, not a separate destination
- Auth = platform link in one OAuth step

## Design Loop Status

| Scenario | Step | Page | Status | Date |
|----------|------|------|--------|------|
| 01-the-enthusiasts-round | 1.1 | Session Home | discussed | 2026-03-24 |
| 01-the-enthusiasts-round | 1.1 | Session Home | wireframed | 2026-03-25 |
| 01-the-enthusiasts-round | 1.2 | Tape List | discussed | 2026-03-24 |
| 01-the-enthusiasts-round | 1.2 | Tape List | wireframed | 2026-03-25 |
| 01-the-enthusiasts-round | 1.4 | Song Search | removed | 2026-03-24 |
| 01-the-enthusiasts-round | 1.3 | Tape Submission | discussed | 2026-03-24 |
| 01-the-enthusiasts-round | 1.3 | Tape Submission | wireframed | 2026-03-25 |
| 01-the-enthusiasts-round | 1.4 | Tape Playlist Ready | discussed | 2026-03-24 |
| 01-the-enthusiasts-round | 1.5 | Tape Voting | discussed | 2026-03-24 |
| 01-the-enthusiasts-round | 1.6 | Tape Reveal | discussed | 2026-03-24 |
| 02-the-casuals-first-session | 2.1 | Invite Landing | discussed | 2026-03-24 |
| 02-the-casuals-first-session | 2.3 | Platform Link | removed | 2026-03-24 |
| 02-the-casuals-first-session | 2.2 | Auth Sign Up | discussed | 2026-03-24 |
| 02-the-casuals-first-session | 2.3 | Profile Account | removed | 2026-03-24 |
| 03-the-hosts-new-session | 3.1 | Create Tape | discussed | 2026-03-24 |
| 04-the-hosts-session-edits | 4.1 | Session Admin | discussed | 2026-03-24 |
| 01-the-enthusiasts-round | 1.1 | Session Home | building | 2026-03-25 |
| 01-the-enthusiasts-round | 1.1 | Session Home | built | 2026-03-25 |
| 01-the-enthusiasts-round | 1.2 | Tape List | building | 2026-03-25 |
| 01-the-enthusiasts-round | 1.2 | Tape List | built | 2026-03-25 |
| 01-the-enthusiasts-round | 1.3 | Tape Submission | building | 2026-03-25 |
| 01-the-enthusiasts-round | 1.3 | Tape Submission | built | 2026-03-25 |
| 01-the-enthusiasts-round | 1.5 | Tape Comments | building | 2026-03-25 |
| 01-the-enthusiasts-round | 1.5 | Tape Comments | built | 2026-03-25 |
| 01-the-enthusiasts-round | 1.6 | Tape Reveal | building | 2026-03-25 |
| 01-the-enthusiasts-round | 1.6 | Tape Reveal | built | 2026-03-25 |
| 02-the-casuals-first-session | 2.1 | Invite Landing | building | 2026-03-25 |
| 02-the-casuals-first-session | 2.1 | Invite Landing | built | 2026-03-25 |
| 02-the-casuals-first-session | 2.2 | Auth Sign Up | merged into 2.1 | 2026-03-25 |
| 03-the-hosts-new-session | 3.1 | Create Tape | building | 2026-03-25 |
| 03-the-hosts-new-session | 3.1 | Create Tape | built | 2026-03-25 |
| 04-the-hosts-session-edits | 4.1 | Session Admin | building | 2026-03-25 |
| 04-the-hosts-session-edits | 4.1 | Session Admin | built | 2026-03-25 |

## Completed
- **Phase 1: Product Brief** — Complete (2026-03-25)
- **Phase 2: Trigger Mapping** — Complete (2026-03-24, Suggest mode)
  - Business Goals: 3-tier flywheel (Participation → Quality → Growth)
  - Personas: The Enthusiast (primary), The Casual (secondary), The Host (tertiary)
  - 18 driving forces scored and prioritized
  - Key insight: Friction elimination (14-15) and social discovery (14-15) dominate priorities
  - Output: `_bmad-output/B-Trigger-Map/`
- **Phase 3: UX Scenarios** — Complete (2026-03-24, Suggest mode)
  - 4 scenarios covering 13 pages, all quality scores Excellent
  - Key decision: Split Host into two scenarios (session creation vs. ongoing edits) per Sam's input
  - Key decision: Playlist generation happens after submission close (page 9), not as a separate post-reveal view — users listen in their native music app then return to vote
  - Output: `_bmad-output/C-UX-Scenarios/`

### 2026-03-24 — Phase 3: UX Scenarios Complete

**Scenarios:** 4 scenarios covering 13 pages
**Quality:** Excellent (all scenarios scored 7/7, 7/7, 7/7, 4/4)

**Artifacts Created:**
- `C-UX-Scenarios/00-ux-scenarios.md` — Scenario index with coverage matrix
- `C-UX-Scenarios/01-the-enthusiasts-round/01-the-enthusiasts-round.md` — The Enthusiast's Round
- `C-UX-Scenarios/01-the-enthusiasts-round/01.1-session-home/01.1-session-home.md` — First step page spec
- `C-UX-Scenarios/02-the-casuals-first-session/02-the-casuals-first-session.md` — The Casual's First Session
- `C-UX-Scenarios/02-the-casuals-first-session/02.1-invite-landing/02.1-invite-landing.md` — First step page spec
- `C-UX-Scenarios/03-the-hosts-new-session/03-the-hosts-new-session.md` — The Host's New Session
- `C-UX-Scenarios/03-the-hosts-new-session/03.1-create-tape/03.1-create-tape.md` — First step page spec
- `C-UX-Scenarios/04-the-hosts-session-edits/04-the-hosts-session-edits.md` — The Host's Session Edits
- `C-UX-Scenarios/04-the-hosts-session-edits/04.1-session-admin/04.1-session-admin.md` — First step page spec

**Summary:** Four scenarios trace the complete Anonymix experience: the core game loop (Enthusiast), onboarding (Casual), session creation (Host), and ongoing session management (Host). Sam's input reshaped the Host scenarios from one to two, separating initial setup from ongoing edits. The playlist-as-handoff insight (listen in native app, return to vote) was a correction from Phase 2 that clarified the game loop flow.

**Next:** Phase 4 — UX Design

## Backlog
- **Phase 4: UX Design** — Next up
- **Phase 5: Development**
