## Why

The existing seed data has a single session (`hello world`) that is **still active** (`ended = false`) with only 2 players. To iterate on the completed session view — especially the summary stats (top songs, most active commenters) — we need a fully completed session with more players showing varied engagement patterns: power commenters, lurkers who submitted but never commented, a player who skipped tapes, etc.

## What Changes

- **Add 4 new seed players** (no auth users — they're NPCs for visual testing) with distinct avatars/colors
- **Add a new completed session** (`ended = true`, `completed_at` set) named "summer mixtape" with Sam as admin and all 6 players as members
- **Add 4 tapes all in `results` status** plus 1 `skipped` tape — representing a realistic completed session
- **Add submissions and comments with varied engagement**:
  - Sam: submitted all tapes, commented on most songs (power user)
  - 2 players: submitted all tapes, moderate commenting
  - 1 player: submitted 3/4 tapes, light commenting
  - 1 player: submitted 2/4 tapes, zero comments (lurker)
  - Sammie: submitted 1/4 tapes, some comments (low engagement)

This gives the completed session view meaningful data for: multiple top-commented songs, a clear "most active" commenter, tapes with different submission counts, and the skipped tape edge case.

## Non-goals

- Modifying the existing `hello world` session seed data
- Adding auth users for the new players (only Sam needs auth for testing)
- Changing any frontend code (this is data-only)
- Adding new migrations

## Capabilities

### New Capabilities

_None — seed data only._

### Modified Capabilities

- `session-data-model`: Expanding seed data to cover the completed session scenario

## Impact

- Seed data file: new JSON + new SQL inserts appended to `seed.sql`
- Zero migration impact — uses existing schema
- Preview branches will get the new data on next reset/seed
