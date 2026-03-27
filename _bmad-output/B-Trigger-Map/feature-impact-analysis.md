# Feature Impact Analysis

> Prioritized driving forces scored by Frequency × Intensity × Fit

**Document:** Trigger Map - Feature Impact Analysis
**Created:** 2026-03-24
**Status:** COMPLETE

---

## Scoring Method

Each driving force scored on three dimensions (1-5 scale):
- **Frequency:** How often does this force matter? (5 = every interaction)
- **Intensity:** How strongly do they feel this? (5 = critical, blocks action)
- **Fit:** How well can Anonymix address this? (5 = perfect fit, direct solution)

**Total = Frequency + Intensity + Fit (max 15)**

---

## The Enthusiast (PRIMARY) — Driving Forces

### Wants

| # | Driving Force | Freq | Int | Fit | Total | Priority |
|---|---|---|---|---|---|---|
| E-W1 | Discover music through trusted friends | 5 | 5 | 5 | **15** | HIGH |
| E-W2 | Express identity through curation | 4 | 4 | 5 | **13** | MEDIUM |
| E-W3 | Experience the social moment of the reveal | 4 | 5 | 5 | **14** | HIGH |

### Fears

| # | Driving Force | Freq | Int | Fit | Total | Priority |
|---|---|---|---|---|---|---|
| E-F1 | Friction killing the vibe (ads, auth, clunky UI) | 5 | 5 | 5 | **15** | HIGH |
| E-F2 | Competition overshadowing connection | 3 | 4 | 5 | **12** | MEDIUM |
| E-F3 | Being excluded by platform (Spotify-only) | 3 | 5 | 5 | **13** | MEDIUM |

**Enthusiast Summary:** Discovery (15), friction elimination (15), and reveal moment (14) are highest priority. These are the core product experience.

---

## The Casual (SECONDARY) — Driving Forces

### Wants

| # | Driving Force | Freq | Int | Fit | Total | Priority |
|---|---|---|---|---|---|---|
| C-W1 | Participate without effort | 5 | 4 | 5 | **14** | HIGH |
| C-W2 | Feel included in the group activity | 5 | 4 | 4 | **13** | MEDIUM |
| C-W3 | Get a good playlist out of it | 4 | 3 | 5 | **12** | MEDIUM |

### Fears

| # | Driving Force | Freq | Int | Fit | Total | Priority |
|---|---|---|---|---|---|---|
| C-F1 | Too many steps to participate | 5 | 4 | 5 | **14** | HIGH |
| C-F2 | Falling behind and feeling guilty | 3 | 3 | 4 | **10** | LOW |
| C-F3 | Being judged for music taste | 3 | 4 | 5 | **12** | MEDIUM |

**Casual Summary:** Effortless participation (14) and minimal steps (14) are the retention levers. Anonymous submissions (12) directly addresses taste judgment fear.

---

## The Host (TERTIARY) — Driving Forces

### Wants

| # | Driving Force | Freq | Int | Fit | Total | Priority |
|---|---|---|---|---|---|---|
| H-W1 | Create rounds effortlessly | 4 | 4 | 5 | **13** | MEDIUM |
| H-W2 | See the group engaged (glanceable status) | 5 | 4 | 4 | **13** | MEDIUM |
| H-W3 | Write prompts that spark great submissions | 3 | 4 | 3 | **10** | LOW |

### Fears

| # | Driving Force | Freq | Int | Fit | Total | Priority |
|---|---|---|---|---|---|---|
| H-F1 | Admin becoming a chore | 4 | 5 | 5 | **14** | HIGH |
| H-F2 | Being the only one who can host | 2 | 4 | 4 | **10** | LOW |
| H-F3 | Participation dropping without knowing why | 3 | 4 | 3 | **10** | LOW |

**Host Summary:** Admin fatigue (14) is the critical risk — if hosting feels like work, the game dies. Round creation (13) and status visibility (13) support this.

---

## Priority Matrix

### HIGH PRIORITY (14-15) — Must address in core product

| Code | Force | Score | Persona | Design Implication |
|---|---|---|---|---|
| E-W1 | Discover music through trusted friends | 15 | Enthusiast | Core game loop: anonymous submit → listen → comment → reveal |
| E-F1 | Friction killing the vibe | 15 | Enthusiast | Zero ads, clean auth, fast PWA, minimal steps |
| E-W3 | Social moment of the reveal | 14 | Enthusiast | Reveal as a designed moment, not just a state change |
| C-W1 | Participate without effort | 14 | Casual | Submit = search + tap. Comment = listen + share what resonated. Done. |
| C-F1 | Too many steps to participate | 14 | Casual | Audit every flow for step count. Eliminate optional fields. |
| H-F1 | Admin becoming a chore | 14 | Host | One-screen tape creation. Smart defaults. Auto-reminders. |

### MEDIUM PRIORITY (11-13) — Should address if feasible

| Code | Force | Score | Persona | Design Implication |
|---|---|---|---|---|
| E-W2 | Express identity through curation | 13 | Enthusiast | Custom prompts, one-song format, the pick IS the statement |
| E-F3 | Platform exclusion (Spotify-only) | 13 | Enthusiast | Spotify + YouTube Music as equal first-class citizens |
| H-W1 | Create rounds effortlessly | 13 | Host | Prompt + deadline + go. Minimal required fields. |
| H-W2 | Glanceable engagement status | 13 | Host | Submission/comment counts visible without admin drill-down |
| C-W2 | Feel included in group activity | 13 | Casual | Notifications, clear deadlines, welcoming onboarding |
| E-F2 | Competition overshadowing connection | 12 | Enthusiast | Resonance framing, no aggregate leaderboard, per-tape only |
| C-W3 | Good playlist output | 12 | Casual | Auto-generated on their platform, one-tap save |
| C-F3 | Judged for music taste | 12 | Casual | Anonymous through commenting. Safe to pick anything. |

### LOW PRIORITY (8-10) — Nice to have, future iterations

| Code | Force | Score | Persona | Design Implication |
|---|---|---|---|---|
| C-F2 | Falling behind / guilt | 10 | Casual | No streaks, no shame. Join any round fresh. |
| H-W3 | Prompts that spark great submissions | 10 | Host | Prompt inspiration/suggestions (future feature) |
| H-F2 | Only one who can host | 10 | Host | Admin transfer capability (post-MVP) |
| H-F3 | Participation dropping without visibility | 10 | Host | Basic analytics for host (post-MVP) |

---

## Strategic Rationale

**The pattern is clear:** The highest-scoring forces cluster around two themes:

1. **Frictionless participation** (E-F1: 15, C-W1: 14, C-F1: 14, H-F1: 14) — The product wins or loses on how effortless it is to use. This is the #1 design priority across all personas.

2. **Social music discovery** (E-W1: 15, E-W3: 14) — The core value proposition. Anonymous curation → listening → reveal creates a social experience that algorithms can't replicate.

**Design for friction elimination first, social discovery second, everything else follows.**

---

## Development Phases (Aligned with Flywheel)

### Phase 1: Core Loop (MVP)
Address all HIGH priority forces:
- Frictionless submit/comment flow (C-W1, C-F1, E-F1)
- Anonymous game loop with reveal (E-W1, E-W3)
- One-screen tape creation (H-F1)
- Spotify + YouTube Music auth (E-F3)
- Auto-generated playlists (C-W3)

### Phase 2: Polish
Address MEDIUM priority forces:
- Resonance framing throughout UI (E-F2)
- Notifications and deadline reminders (C-W2)
- Host status dashboard (H-W2)
- Onboarding flow (C-W2)

### Phase 3: Growth Features
Address LOW priority forces:
- Prompt suggestions/inspiration (H-W3)
- Admin transfer (H-F2)
- Host analytics (H-F3)

---

## Related Documents

- **[trigger-map.md](trigger-map.md)** - Visual overview and navigation
- **[01-Business-Goals.md](01-Business-Goals.md)** - Objectives and metrics
- **[personas/01-the-enthusiast.md](personas/01-the-enthusiast.md)** - Primary persona
- **[personas/02-the-casual.md](personas/02-the-casual.md)** - Secondary persona
- **[personas/03-the-host.md](personas/03-the-host.md)** - Tertiary persona

---

_Back to [Trigger Map](trigger-map.md)_
