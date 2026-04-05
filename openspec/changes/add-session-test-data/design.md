## Context

The completed session view shows summary stats: tapes completed, total songs, total comments, most-commented songs, and most active commenters. The current seed only has 2 players and no completed session, making it impossible to visually test this view with realistic data.

## Goals / Non-Goals

**Goals:**
- Provide a completed session with 6 players and varied engagement for visual testing
- Create enough data variety to exercise all summary stat code paths (ties, zero-comment songs, skipped tapes)
- Keep seed data realistic — real song names, reasonable comment patterns

**Non-Goals:**
- Auth users for new players
- Modifying existing seed data

## Decisions

### 1. New JSON data file + append to seed.sql (same pattern as existing)

Follow the existing convention: source of truth in `supabase/seed-data/summer-mixtape-session.json`, SQL inserts appended to `seed.sql`.

### 2. Player engagement tiers

| Player | Tapes submitted | Comment activity | Role |
|--------|----------------|------------------|------|
| Sam (existing) | 4/4 | Heavy — comments on most songs + tape-level | Admin, power user |
| Sammie (existing) | 1/4 | Light — a few comments | Low engagement |
| Jules (new) | 4/4 | Moderate — comments on ~half the songs | Engaged member |
| Mika (new) | 3/4 | Light — a few comments here and there | Casual |
| Rio (new) | 2/4 | Zero comments | Lurker |
| Dani (new) | 4/4 | Moderate — tape-level comments mostly | Tape-reactor |

### 3. Session structure

- **Session**: "summer mixtape", slug `summer-mixtape-<first4uuid>`, `ended = true`, `completed_at` set
- **5 tapes**, all terminal status:
  - Tape 1: "opening track" / "songs that should start every playlist" → `results`
  - Tape 2: "guilty pleasures" / "songs you'd never admit to loving" → `results`
  - Tape 3: "main character energy" / "songs that make you feel unstoppable" → `results`
  - Tape 4: "the closer" / "perfect last song of the night" → `results`
  - Tape 5: "bonus round" / "wildcard — anything goes" → `skipped` (no submissions)

### 4. Comment distribution for interesting summary stats

- Target: ~25-30 total comments across all tapes
- At least one song should have 4+ comments (clear "most commented")
- Sam should be the most active commenter (~10-12 comments)
- A few tape-level comments mixed in
- One tape with only 2-3 comments total (sparse)

### 5. Song choices (real Deezer tracks)

Use recognizable songs with valid Deezer cover art URLs. The `deezer_id` values don't need to resolve in the seed (Deezer API isn't hit for display), but cover_art_url should be real CDN URLs for visual testing.

## Data Volume

- 4 new players
- 1 new session
- 5 new tapes
- ~17-19 submissions (across 4 results tapes × varying player participation)
- ~25-30 comments
