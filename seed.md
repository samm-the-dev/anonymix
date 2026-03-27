# Anonymix — Project Seed

## Concept

A music sharing app for friends centered on themed submissions, anonymous voting, and conversation. De-emphasizes competition in favor of curation and connection. Players submit songs to prompts, vote positively on what resonates, and discuss picks together. The artifact of each round is a shared playlist.

## Terminology

- **Anonymix** — the app
- **Session** — the top-level group/container (what Music League calls a "league")
- **Tape** — a single round within a session, built around one prompt

## Core Game Loop

- Host creates a session and invites players
- Host creates a tape with a custom prompt (e.g. "a song that reminds you of a specific summer")
- Players submit one song anonymously
- Submissions are hidden until everyone has submitted (or deadline passes)
- Submissions are revealed — players vote and comment on picks (not their own)
- No downvotes — voting is positive/resonance-based
- Per-tape scores are visible; no aggregate session leaderboard (league mode a future option)
- A playlist is generated from the tape's tracks at close
- Repeat for next tape

## Tone & Design Direction

- Sharing and discovery over competition
- Votes framed as resonance ("this hit for X people") not raw scores
- Prompts are always custom — no preset prompts at launch
- Comments and chat are first-class features, not secondary
- Anonymity of submissions preserved until reveal to keep voting unconflicted

## Auth

- Players choose Spotify or Google (YouTube Music) as their platform
- Spotify users: standard OAuth flow → exchange token via Cloud Function → mint Firebase custom token
- Google users: existing Google OAuth → Firebase Auth directly
- Firebase Auth is the unified identity layer regardless of entry point

## Integrations

- **Spotify**: OAuth for login + `playlist-modify-private` scope for playlist generation
- **YouTube Data API v3**: OAuth for login + playlist creation/modification
- Platform choice is per-user
- Integrations are login + playlist generation only (no cross-platform sync needed)

## Backend — Google Cloud

- **Firestore**: primary data store
  - Session documents with subcollections for tapes, submissions, votes, chat
  - Real-time listeners for pushing tape state to all players
- **Cloud Functions**:
  - Spotify token exchange → Firebase custom token (mirrors existing OHM Google auth function pattern)
  - Game logic triggers (e.g. advance tape when all votes are in, calculate scores)
  - Playlist generation on tape close
- **Firebase Auth**: unified identity via custom tokens (Spotify path) or direct (Google path)
- **Security Rules**: hide submissions until voting opens, restrict votes to participants, etc.

## Legal / IP Notes

- Mechanics and abstract design are not protected — free to implement
- Avoid visual similarity to Music League's specific UI (trade dress)
- Spotify Developer ToS is the main constraint for Spotify integration
- Revisit with a lawyer if project goes beyond personal use

## Open Questions

- Voting mechanic details (fixed number of votes per tape? unlimited upvotes?)
- Submission deadline enforcement (hard cutoff vs. all-in advances the tape)
- Per-tape score display format
- Chat timing (open throughout, or only during/after reveal?)

## Development Methodology — BMAD + OpenSpec

### Why both

- **BMAD** handles discovery and planning — PM persona scopes the MVP, architect designs the Firestore schema and auth flows, resolves the open questions above
- **OpenSpec** handles delivery — each implementation unit (auth, game loop, voting, playlist generation) gets its own propose/apply/archive cycle with tracked specs and tasks

BMAD tells you *what* to build and *why*. OpenSpec manages *how* each piece gets implemented and tracked.

### Workflow

1. **BMAD analysis phase** — work through open questions, produce a one-page PRD, user stories with acceptance criteria, and minimal architecture design
2. **Break BMAD output into OpenSpec changes** — each major feature becomes an OpenSpec change directory with proposal, specs, design, and tasks
3. **Implement via OpenSpec cadence** — `/opsx:propose` → `/opsx:apply` → `/opsx:archive` for each change unit
4. **Iterate** — BMAD artifacts are living docs, update as decisions evolve

### Suggested change units (refine after BMAD analysis)

- `auth-spotify` — Spotify OAuth + Firebase custom token flow
- `auth-google` — Google OAuth + Firebase Auth
- `session-management` — create/join sessions, invite flow
- `tape-lifecycle` — create tape, submit, reveal, close
- `voting` — positive voting mechanic, score calculation
- `chat` — real-time comments/discussion
- `playlist-generation` — Spotify/YouTube playlist creation on tape close

### Consulting skill practiced

Taking a product brief through structured discovery (BMAD) into tracked delivery (OpenSpec) — the full consulting engagement lifecycle, not just coding.
