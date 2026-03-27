# Prototype Roadmap — Scenario 01: The Enthusiast's Round

## Setup

| Setting | Value |
|---------|-------|
| Device | Mobile-only (375px-428px) |
| Test viewports | iPhone SE (375x667), iPhone 14 Pro (393x852), iPhone 14 Pro Max (428x926) |
| Design fidelity | Gray model (wireframe) |
| Language | English only |
| Demo data | 5 players, 2 sessions (1 active, 1 ended) |

## Scenario Overview

The Enthusiast's core game loop: find active tape, submit a song, receive the playlist, comment, experience the reveal.

**Persona:** The Enthusiast — late 20s, couch, post-dinner ritual player.
**Entry:** Push notification (primary) or app open (fallback).
**Best outcome:** Song submitted under a minute, playlist saved, comments shared, reveal experienced.

## Pages

| Page | Name | Complexity | Wireframe | Critical Path |
|------|------|-----------|-----------|--------------|
| 01.1 | Session Home | Low | Yes | No (notification bypasses) |
| 01.2 | Tape List (Session View) | Medium | Yes | No (exploratory) |
| 01.3 | Tape Submission | High | Yes | Yes — core action |
| 01.4 | Tape Playlist Ready | Low | No (card state) | Yes |
| 01.5 | Tape Comments | Medium | No | Yes |
| 01.6 | Tape Reveal | Medium-High | No | Yes — emotional climax |

## Recommended Build Order

1. **01.1 Session Home** — simplest, establishes layout patterns and navigation
2. **01.2 Tape List** — introduces the crate/card metaphor used everywhere
3. **01.3 Tape Submission** — core creative action, highest complexity
4. **01.5 Tape Comments** — comment interface
5. **01.4 Tape Playlist Ready** — card state, quick to build once card pattern exists
6. **01.6 Tape Reveal** — reveal animation is the climax, benefits from all prior patterns

## Demo Data

See `data/demo-data.json`.

**Players:** Sam (current user, admin of Comic Book Fuckery), Cristina, Brent (admin of Playlist Pandamonium), Jason, Kelly.

**Active session — "Comic Book Fuckery":**
- 6 tapes, Marvel/DC character themes
- Tape 1: commenting phase (3 commented, waiting on Sam + Brent)
- Tape 2: submitting (Sam submitted, 4 waiting)
- Tapes 3-6: upcoming/submitting

**Ended session — "Playlist Pandamonium":**
- 4 tapes, all completed with results revealed
- Provides data for completed/reveal states

## Progress

| Page | Status | Date |
|------|--------|------|
| 01.1 Session Home | Complete | 2026-03-25 |
| 01.2 Tape List | Complete | 2026-03-25 |
| 01.3 Tape Submission | Complete | 2026-03-25 |
| 01.5 Tape Comments | Complete | 2026-03-25 |
| 01.6 Tape Reveal | Complete | 2026-03-25 |
