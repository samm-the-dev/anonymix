## 1. Create new player seed data

- [ ] 1.1 Add 4 new players to `seed.sql` (Jules, Mika, Rio, Dani) with distinct avatars and colors, `auth_id = null` (design: Player engagement tiers)
- [ ] 1.2 Create `supabase/seed-data/summer-mixtape-session.json` with the player entries for reference

## 2. Create completed session and membership

- [ ] 2.1 Add the "summer mixtape" session with `ended = true`, `completed_at` set, Sam as admin (design: Session structure)
- [ ] 2.2 Add all 6 players as session members in `session_players`

## 3. Create tapes

- [ ] 3.1 Add 5 tapes: 4 in `results` status with past deadlines, 1 in `skipped` status (design: Session structure — tape list)

## 4. Create submissions with varied participation

- [ ] 4.1 Add submissions for tape 1 "opening track" — all 6 players except Sammie and Rio (Sam, Jules, Mika, Dani = 4 submissions)
- [ ] 4.2 Add submissions for tape 2 "guilty pleasures" — Sam, Sammie, Jules, Dani (4 submissions; Mika and Rio skip)
- [ ] 4.3 Add submissions for tape 3 "main character energy" — Sam, Jules, Mika, Rio, Dani (5 submissions; Sammie skips)
- [ ] 4.4 Add submissions for tape 4 "the closer" — Sam, Jules, Rio, Dani (4 submissions)
- [ ] 4.5 No submissions for tape 5 "bonus round" (skipped)

## 5. Create comments with engagement tiers

- [ ] 5.1 Add Sam's comments: ~10-12 across all tapes, mix of per-song and tape-level (design: Comment distribution)
- [ ] 5.2 Add Jules's comments: ~5-6, mostly per-song
- [ ] 5.3 Add Dani's comments: ~4-5, mostly tape-level
- [ ] 5.4 Add Sammie's comments: ~2-3 per-song comments
- [ ] 5.5 Add Mika's comments: ~2 sparse comments
- [ ] 5.6 Rio: zero comments (lurker — verify summary handles this)

## 6. Update JSON reference and verify

- [ ] 6.1 Ensure `summer-mixtape-session.json` matches all SQL inserts
- [ ] 6.2 Verify SQL runs without errors against current schema (check column names, FK references, unique constraints)
