# Story: Session View — Section 4: Tape Card State Variants

## Purpose
Extend the active tape card to render different content based on tape status. Each state shows the header + title/prompt, but the lower section changes.

## Specifications Reference
- `01.2-tape-list.md` — Tape List page spec
- `01.4-tape-playlist-ready.md` — Playlist Ready spec (card state, not separate page)
- `Session-View-Work.yaml` — Section 4 definition

## State Variants

### Submitting (existing)
- Progress bar: "X/Y submitted"
- User submission: "Your pick" + song — artist + "Change" link
- If not submitted: "Submit your pick" CTA button (green)

### Playlist Ready
- "Playlist ready" message
- Platform CTA: "Open in Spotify" or "Open in YouTube Music" button (blue, filled)
- Track count: "5 songs"
- Idempotent — always tappable

### Commenting
- "Time to comment" or progress: "X/Y commented"
- If not commented: "Leave comments" CTA button (amber)
- If commented: "Comments shared" muted confirmation + "Change comments" link

### Completed (results)
- Winner display: #1 song — artist
- "See full results" CTA button (purple)
- Or compact ranking: top 3 songs listed

## HTML Patterns

Each state reuses the card shell (header, title, prompt) but swaps the lower section:

```
<!-- Lower section varies by state -->
${stateContent}
```

## Tailwind Classes

- **CTA button (generic):** `w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center`
- **Green CTA:** `bg-green-500 hover:bg-green-600`
- **Blue CTA:** `bg-blue-500 hover:bg-blue-600`
- **Amber CTA:** `bg-amber-500 hover:bg-amber-600`
- **Purple CTA:** `bg-purple-500 hover:bg-purple-600`
- **Muted confirmation:** `text-sm text-gray-400 font-medium`
- **Winner song:** `text-sm font-semibold text-gray-900`
- **Rank number:** `text-xs font-bold text-purple-500`

## JavaScript Requirements

### Functions
- `renderCardContent(tape, session, currentUser)` — routes to state-specific renderer
- `renderSubmittingContent(tape, session, currentUser)` — existing progress + submission
- `renderPlaylistReadyContent(tape, session, currentUser)` — platform CTA
- `renderCommentingContent(tape, session, currentUser)` — comment progress or CTA
- `renderCompletedContent(tape, session, currentUser)` — winner + results CTA

### Data
- Use different tapes from Comic Book Fuckery to show each state
- Flip through with crate-flip (Section 5) to see all states — for now, change activeTapeIndex manually to test

## Acceptance Criteria

### Agent-Verifiable
- [ ] Submitting state: progress bar + submission (existing, still works)
- [ ] Submitting state without submission: shows "Submit your pick" CTA
- [ ] Playlist Ready: shows platform CTA button
- [ ] Commenting before commenting: shows "Leave comments" CTA
- [ ] Commenting after commenting: shows muted confirmation
- [ ] Completed: shows winner and "See full results" CTA
- [ ] All states maintain fixed 260px card height

### User-Evaluable
- [ ] Each state feels distinct but consistent
- [ ] CTAs are clear about what action to take
- [ ] Completed state feels like a satisfying summary
