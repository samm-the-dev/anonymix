## Why

The reveal is the emotional payoff of the entire product — "Jake picked THAT?!" Currently tapes reach `results` status but there's no page behind it. Users need to see who submitted each song and read the comments each pick received. Without this, the loop is incomplete.

Reference: [01.6-tape-reveal scenario](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.6-tape-reveal/01.6-tape-reveal.md), [tape-reveal.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/tape-reveal.html)

## What Changes

- New **reveal page** at `/session/:sessionId/tape/:tapeId/reveal` — accordion list of songs in shuffled order, expanding to show submitter identity + per-song comments
- "The Tape" overall comments shown at the bottom
- Tape lifecycle simplified: remove `commenting` status, lifecycle is now `submitting` → `playlist_ready` → `results`. Host can trigger reveal manually; deadline auto-advances.
- Session view tape card gets "See Reveal" button when status is `results`
- Session home card action button navigates to reveal page for `results` status

## Non-goals

- Chat/messaging between players (future feature, scaling considerations)
- Reveal animations beyond basic accordion expand (CSS transition is fine for now)
- Re-ordering or ranking songs — display is shuffled, no hierarchy

## Capabilities

### New Capabilities
- `reveal-page`: Dedicated reveal page with per-song accordion showing submitter identity and comments

### Modified Capabilities
- `session-view`: Tape card for `results` status navigates to reveal page instead of placeholder button
- `session-home-page`: Action button for `results` navigates to reveal page

## Impact

- New page: `src/pages/RevealPage.tsx`
- Route addition in `src/App.tsx`
- Migration: remove `commenting` from `tape_status` enum, update pg_cron job
- Update `SessionViewPage.tsx` results card
- Update `SessionCard.tsx` action button for results
- Update `database.types.ts` for enum change
