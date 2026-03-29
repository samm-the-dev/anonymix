## Why

When a tape reaches `playlist_ready`, users need to listen to the submissions and leave comments. Currently the session view shows a playlist card with copy-for-TMM button, but there's no commenting flow and the playlist import instructions aren't clear. We need a dedicated full page that combines listening setup and commenting into one flow.

Reference: [01.4-tape-playlist-ready](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.4-tape-playlist-ready/01.4-tape-playlist-ready.md), [01.5-tape-voting](_bmad-output/C-UX-Scenarios/01-the-enthusiasts-round/01.5-tape-voting/01.5-tape-voting.md), [tape-voting.html prototype](_bmad-output/D-Prototypes/01-the-enthusiasts-round-prototype/tape-voting.html)

## Non-goals

- Reveal phase (01.6) — separate change
- Per-song Odesli/song.link buttons (can add later)
- Draft auto-save for comments (can add later)
- Push notifications for commenting deadline

## What Changes

- **New "Listen & Comment" page** at `/session/:id/tape/:tapeId/comment`: Full page with listening instructions, song list with per-song comment fields, "The Tape" overall comment, and submit button
- **Expandable TMM instructions section**: Platform dropdown + copy button + step-by-step instructions for importing into their music app
- **Per-song comment fields**: Each submission (excluding user's own) gets an optional comment textarea. Low-pressure "no worries" framing from prototype.
- **"The Tape" overall comment**: One field for reacting to the tape as a whole
- **Submit comments**: Saves all comments to Supabase, returns to session view
- **Session view tape card simplified**: For `playlist_ready` status, show just "Listen & Comment" action button + comment progress bar. No song list in the card.
- **Action button navigation**: "Listen & Comment" from session home and session view navigates to the new page

## Capabilities

### New Capabilities
- `listen-and-comment-page`: Full page combining TMM playlist import instructions with per-song commenting

### Modified Capabilities
- `session-view`: Remove playlist song list from tape card. Show comment progress and "Listen & Comment" button for playlist_ready.
- `session-home-page`: Action button for playlist_ready navigates to comment page instead of session view.

## Impact

- **New file**: `src/pages/ListenCommentPage.tsx`
- **New route**: `/session/:sessionId/tape/:tapeId/comment`
- **Modified**: `SessionViewPage.tsx` (simplified playlist_ready card), `SessionCard.tsx` (action button nav), `App.tsx` (route)
- **Schema**: Comments table already exists. Need to store per-submission comments (currently comments reference tape_id + player_id + text — may need submission_id reference for per-song comments)
