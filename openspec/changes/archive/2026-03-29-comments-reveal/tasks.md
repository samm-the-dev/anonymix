## 1. Schema

- [x] 1.1 Create migration: update any `commenting` tapes to `playlist_ready`, then remove `commenting` from `tape_status` enum
- [x] 1.2 Create migration: update pg_cron job to advance `playlist_ready` → `results` (remove `commenting` step) — N/A, cron only had submitting→playlist_ready
- [x] 1.3 Update `database.types.ts` to remove `commenting` from tape status
- [x] 1.4 Update `src/lib/types.ts` TapeStatus type to remove `commenting`
- [x] 1.5 Push migrations

## 2. Reveal Page

- [x] 2.1 Create `src/pages/RevealPage.tsx` with session context bar, tape info, and accordion song list — ref: prototype tape-reveal.html
- [x] 2.2 Fetch session name, tape info, all submissions, all comments (per-song + tape-level), and player info for submitters/commenters
- [x] 2.3 Implement seeded shuffle of submissions based on tape ID
- [x] 2.4 Build accordion rows: album art + song title + artist + chevron, expand/collapse with CSS max-height transition
- [x] 2.5 Build expanded content: "Submitted by [name]" with avatar, then per-song comments with commenter avatar + name + text
- [x] 2.6 Build "The Tape" section at bottom with tape-level comments

## 3. Route & Navigation

- [x] 3.1 Add route `/session/:sessionId/tape/:tapeId/reveal` inside Layout in App.tsx
- [x] 3.2 Update SessionViewPage: results card shows "See Reveal" button navigating to reveal page
- [x] 3.3 Update SessionViewPage: host gets "Reveal" button on playlist_ready card to advance to results
- [x] 3.4 Update SessionCard action button: results navigates to reveal page, label "Reveal"
- [x] 3.5 Remove references to `commenting` status in SessionViewPage and SessionCard

## 4. Verify & Commit

- [x] 4.1 Type check, verify reveal page renders
- [ ] 4.2 Commit all changes
