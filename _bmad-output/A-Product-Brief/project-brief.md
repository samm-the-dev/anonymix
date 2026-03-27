# Product Brief: Anonymix

## Strategic Summary

Anonymix is a music sharing app for friends, built around themed rounds (tapes), anonymous submissions, and positive discovery. It takes the proven game loop of Music League — prompt, submit, vote, playlist — and removes the friction: no platform lock-in (supports both Spotify and YouTube Music), no ads, and no aggregate competition. The real output of each round is a shared playlist and conversation, not a winner.

This is a personal project built for a small friend group, with the possibility of growing into a public product. The architecture and design should reflect that trajectory: simple enough to ship for 5-15 people, extensible enough to handle more if it takes off.

## Vision

Anonymix is a music sharing app for friends built around themed rounds, anonymous submissions, and positive discovery. It exists because the current option (Music League) is platform-locked to Spotify and leans into competition. Anonymix supports both Spotify and YouTube Music users, frames voting as resonance rather than ranking, and treats the shared playlist — not the scoreboard — as the real output of each round. The goal is that everyone walks away with new music to check out.

## Product Concept

**Anonymity-through-judgment.** Submissions are anonymous from submission through voting completion. The reveal — when submitters are attributed — comes after all votes are locked in. This removes social bias from voting, keeps evaluations honest, and makes the reveal a genuine social moment. You find out who picked what only after you've already committed.

### Game Loop

1. Host creates a tape with a custom prompt
2. Players submit one song anonymously
3. Submissions revealed for listening (submitters still anonymous)
4. Players vote and comment (submitters still anonymous)
5. Voting closes — submitters revealed, scores shown
6. Playlist generated from the tape's tracks

## Positioning

For small friend groups who enjoy themed music sharing, Anonymix is a social music game that turns prompts into shared playlists. Unlike Music League, it supports both Spotify and YouTube Music users, frames voting as resonance instead of ranking, and keeps the focus on discovery — no ads, no aggregate leaderboards, just new music to check out.

### Positioning Components

| Component | Value |
|-----------|-------|
| Target | Small friend groups who enjoy themed music sharing |
| Need | Platform-inclusive, low-pressure music sharing with creative prompts |
| Category | Social music sharing game |
| Key Benefit | Everyone discovers new music through a fun, ad-free prompt format |
| Alternatives | Music League, shared playlists, group chat |
| Differentiator | Platform-agnostic, discovery over competition, no ads |

## Target Users

### Primary: The Music Sharer

- Friend group member (typically 5-15 people) who enjoys music and social discovery
- Uses either Spotify or YouTube Music as their primary platform
- Engages on a weekly cadence: submits songs, listens to others' picks, votes, and comments
- Motivated by discovery and connection, not winning
- Engagement varies by life circumstances — some weeks active, some weeks quiet
- Values the playlist as the takeaway, comments as the conversation

### Secondary: The Session Host

- One person in the group who creates sessions, writes prompts, and keeps things moving
- Needs admin tools: invite people, create tapes, set deadlines, remove members, transfer admin role
- Not a power-admin role — just the person who kicks things off and manages the group

### Design Implications

- Homogeneous user base — no need for distinct UI modes or role-based experiences
- Configurable timing is important (submission window, voting window)
- Reduce friction to keep casual engagers from dropping off

## Business Model

**B2C, direct to end users.**

- MVP: Free, personal use. Ko-fi donation link included.
- If public: Subscription or one-time license via Ko-fi to cover costs and earn fair compensation.
- No ads, ever. This is a core positioning differentiator.
- Open to profit, not optimizing for it.

### Implications

- Design for zero revenue initially
- Keep user/auth architecture flexible enough to support access gating later
- Don't over-engineer monetization for MVP

## Success Criteria

**Primary metric:** Session participation — more people joining and staying active per session (baseline: 5 in Music League, success: growth by removing platform/ad barriers)

**Secondary metrics:**
- Tape turnaround — rounds complete faster due to smoother UX (no ads, native playlists)
- Host expansion — others in the group start their own sessions because it's easy

**Timeline:** Validate with friend group within first 2-3 sessions after launch

**Note:** Retention/dropoff is not a current problem — the group sticks with rounds. The win is removing barriers to entry.

## Competitive Landscape

| Alternative | Strengths | Weaknesses |
|---|---|---|
| Music League | Proven game loop, large user base, polished | Spotify-only, ads, competition-focused, broad audience UX |
| Shared playlists | Easy, built into platforms | No game structure, no prompts, no anonymity, no discussion |
| Group chat / artist recs | Zero friction | Completely unstructured, ephemeral, no curation |
| Do nothing | No effort | No discovery, no shared experience |

### Unfair Advantage

No monetization pressure means no ads ever and pure UX optimization. Small scope means fast iteration and platform flexibility. Discovery-first philosophy is a genuine design divergence from Music League, not just a missing feature.

### Reality Check

If Music League adds YouTube Music support — fine, Anonymix UX will still be better and can extend to other services easily. Music League won't drop ads (it's their revenue model) and won't drop competition focus (it drives their engagement model).

## Constraints & Context

### Fixed

- No budget — free-tier services only for now
- Spotify + YouTube Music API compliance (ToS to be reviewed)
- Avoid legal complications with Music League (no trade dress similarity)
- Auth must be easy (low friction onboarding)
- PWA (existing template and tooling available)

### Flexible

- Backend stack — not locked to Firebase, open to alternatives that fit free tier
- Data strategy — attempt real-time first, fall back to poll-on-load if complex/costly. Design UI to work with either approach.
- Can wrap PWA into Android app if needed
- No timeline pressure — done when it's done

## Platform & Device Strategy

- **Primary platform:** PWA
- **Device priority:** Mobile-first, responsive to desktop
- **Interaction:** Touch primary, mouse/keyboard secondary
- **Offline:** Not a priority. Architecturally possible (cache playlists, queue votes) — nice-to-have, not MVP.
- **Accessibility:** Standard web a11y (semantic HTML, screen reader support, WCAG basics)

## Tone of Voice

### Attributes

1. **Minimal** — Say only what's needed
2. **Clear** — Plain language, no cleverness
3. **Quietly warm** — Approachable without performing. Human phrasing without being chatty.
4. **Resonance-framed** — Connection language over competition language

### Examples

| Context | Copy |
|---------|------|
| Submit button | Submit |
| Empty submissions | No submissions yet |
| Vote confirmation | Vote saved |
| Reveal moment | Votes are in |
| Error state | Something went wrong. Try again? |
| Score display | Resonated with 4 |

### Guidelines

- **Do:** Be direct. Be short. Let the content speak.
- **Don't:** Exclamation points. Emoji in system text. Cute error messages. Gamified language.

## Open Questions (from seed, to resolve during implementation)

- Voting mechanic details (fixed number of votes per tape? unlimited upvotes?)
- Submission deadline enforcement (hard cutoff vs. all-in advances the tape)
- Per-tape score display format
- Chat timing (open throughout, or only during/after reveal?)

---

**Status:** Product Brief Complete
**Next Phase:** Trigger Mapping
**Last Updated:** 2026-03-25
