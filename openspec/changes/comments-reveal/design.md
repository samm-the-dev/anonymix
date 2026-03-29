## Context

Tapes currently flow through `submitting` → `playlist_ready` → `commenting` → `results`. The `commenting` status is redundant — listening and commenting happen together on the ListenCommentPage during `playlist_ready`. The `results` status exists but has no page. This change removes the dead status, builds the reveal page, and wires navigation.

The prototype ([tape-reveal.html](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/tape-reveal.html)) shows an accordion list with per-song submitter reveal and comments. The scenario ([01.6-tape-reveal](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.6-tape-reveal/01.6-tape-reveal.md)) emphasizes this is the emotional payoff — identity and connection, not competition.

## Goals / Non-Goals

**Goals:**
- Reveal page showing who submitted each song + comments received
- Accordion per song with satisfying expand/collapse
- Songs displayed in shuffled order (no ranking)
- Tape-level ("The Tape") comments at the bottom
- Remove dead `commenting` status from enum
- Host can trigger reveal from `playlist_ready`

**Non-Goals:**
- Reveal animations beyond CSS transitions
- Re-visiting state tracking (accordion works the same every time)
- Chat feature (future, separate concern)

## Decisions

### 1. Remove `commenting` from tape_status enum

**Decision**: Migration to remove `commenting` value. Update pg_cron job to advance directly from `playlist_ready` to `results`.

**Why**: `commenting` was never used in the UI — the ListenCommentPage serves `playlist_ready` tapes. Keeping a dead enum value creates confusion. The cron job currently has a step for `commenting` → `results` that should become `playlist_ready` → `results`.

**Alternative**: Keep `commenting` for future use. Rejected — YAGNI, and easy to re-add if needed.

### 2. Reveal page as separate route (inside Layout)

**Decision**: `/session/:sessionId/tape/:tapeId/reveal` rendered inside Layout. Session context bar with centered session name (matching session view pattern).

**Why**: Consistent with the listen-and-comment page pattern. Layout provides app bar with back button.

### 3. Shuffled song order

**Decision**: Shuffle submissions client-side using a seeded random based on tape ID. All users see the same order.

**Why**: Random order per the scenario — no implied hierarchy. Seeding on tape ID means the order is stable across refreshes and users, avoiding confusion in conversation ("the third song...").

### 4. Accordion with CSS transitions

**Decision**: React state per-song for expanded/collapsed. CSS `max-height` transition matching the prototype's 250ms ease-out. All start collapsed.

**Why**: The prototype already validated this interaction. Simple state management, no animation library needed.

### 5. Host triggers reveal

**Decision**: Host can advance a `playlist_ready` tape to `results` via a button in the session view tape card (similar to existing "Close submissions" button). The existing pg_cron job handles automatic advancement based on deadline.

**Why**: Gives the host control over reveal timing. Can coordinate with players via external chat before revealing.

## Risks / Trade-offs

- **Removing enum value**: Requires careful migration — must update any rows still in `commenting` status before dropping the value. Mitigation: migration first updates any `commenting` tapes to `playlist_ready`, then alters the enum.
- **Seeded shuffle**: If the seed algorithm changes, order changes for existing tapes. Mitigation: use a simple stable hash (tape ID chars → number) that we won't need to change.
