# 01: The Enthusiast's Round

**Project:** Anonymix
**Created:** 2026-03-24
**Method:** Whiteport Design Studio (WDS)
**Design Intent:** C (Discuss)
**Design Status:** not-started

---

## Transaction (Q1)

**What this scenario covers:**
Play a complete tape round — find the active tape, submit a carefully chosen song, receive the playlist, come back to comment on what resonated, and experience the reveal of who picked what.

---

## Business Goal (Q2)

**Goal:** Active Participation — the engine of the flywheel
**Objective:** 80%+ participation per tape across 5-15 players. A completed round cycle is the core unit of product validation.

---

## User & Situation (Q3)

**Persona:** The Enthusiast (Primary)
**Situation:** Late 20s, on the couch after dinner, sees a notification that a new tape prompt dropped. Immediately starts thinking about the perfect song. They've been in this session for a few weeks — this is their ritual.

---

## Driving Forces (Q4)

**Hope:** Find the perfect song that says something about them, discover what friends picked, experience the reveal moment.

**Worry:** Friction breaking the flow — too many steps between "I know my song" and "submitted."

---

## Device & Starting Point (Q5 + Q6)

**Device:** Mobile
**Entry:** Taps a push notification that a new tape prompt dropped, lands directly in the app.

---

## Best Outcome (Q7)

**User Success:**
Song submitted in under a minute, playlist saved to their Spotify/YouTube Music, comments shared on standouts, reveal experienced — they discovered a song they'd never have found on their own.

**Business Success:**
Full round participation from a core player — submit, listen, comment. The loop that proves the product works.

---

## Shortest Path (Q8)

1. **Session Home** — Sees active sessions, taps into the one with the new tape
2. **Tape List** — Sees the active tape with the prompt, taps into it
3. **Tape: Submission Phase** — Reads the prompt, taps to submit. After submitting, can view/change their submission until the deadline closes.
4. **Song Search** — Searches for their song, taps to confirm submission
5. **Tape: Listening / Playlist Ready** — Submissions closed, playlist added to their account, goes to listen in their music app
6. **Tape: Commenting Phase** — Returns after listening, comments on standout submissions, shares what resonated
7. **Tape: Results / Reveal** — Comments are in, submitters revealed, sees who picked what ✓

---

## Trigger Map Connections

**Persona:** The Enthusiast (Primary)

**Driving Forces Addressed:**
- ✅ **Want:** Discover music through trusted friends (15)
- ❌ **Fear:** Friction killing the vibe (15)

**Business Goal:** Active Participation — 80%+ participation per tape, validates the concept

---

## Scenario Steps

| Step | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 01.1 | `01.1-session-home/` | Find active session | Taps into session with new tape |
| 01.2 | `01.2-tape-list/` | Find the active tape | Taps into active tape |
| 01.3 | `01.3-tape-submission/` | Read prompt, search, submit song | Taps submit → returns to session view on active tape |
| 01.4 | `01.4-tape-playlist-ready/` | Receive playlist, go listen | Leaves app to listen in music player |
| 01.5 | `01.5-tape-voting/` | Comment on submissions | Submits comments |
| 01.6 | `01.6-tape-reveal/` | Experience the reveal | Scenario success ✓ |

**Removed steps:**
- ~~01.4 Song Search~~ — merged into 01.3 (Tape Submission). Search is an on-page interaction, not a separate step.

**Renumbered:** Steps after 01.3 shifted down (old 01.5→01.4, 01.6→01.5, 01.7→01.6).

**First step** (01.1) includes full entry context (Q3 + Q4 + Q5 + Q6).
**On-step interactions** (that don't leave the step) are documented as storyboard items within each page spec.
