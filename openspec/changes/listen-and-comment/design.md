## Context

The comments table currently has `tape_id`, `player_id`, `text`. For per-song commenting, we need to reference which submission the comment is about. A null `submission_id` indicates a tape-level ("The Tape") comment.

The prototype shows: header → tape info + "no worries" framing → per-song rows (album art + title + comment textarea) → "The Tape" comment → submit button.

## Goals / Non-Goals

**Goals:**
- Single page combining playlist import instructions and commenting
- Per-submission comments stored with `submission_id` FK
- User's own submission excluded from comment list
- Low-pressure UX matching prototype tone
- Works for `playlist_ready` status (listening + commenting combined)

**Non-Goals:**
- Draft auto-save on blur (future enhancement)
- Comment editing after submission
- Separate `commenting` tape status — we combine playlist_ready and commenting into one flow

## Decisions

### 1. Schema: add submission_id to comments

**Decision**: Add nullable `submission_id` (FK to submissions, cascade delete) to the comments table. Per-song comments have a `submission_id`. The tape-level "The Tape" comment has `submission_id = null`.

**Migration**: `ALTER TABLE comments ADD COLUMN submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE;`

### 2. One page, not two phases

**Decision**: Skip the separate `commenting` tape status for now. When a tape reaches `playlist_ready`, the action is "Listen & Comment" — one page handles both. The tape stays in `playlist_ready` until the host advances it or a comment deadline passes.

**Why**: The prototype separates playlist_ready and commenting as card states, but the user action is the same — go listen, come back, comment. Combining simplifies the flow.

### 3. Expandable TMM instructions

**Decision**: A collapsible section at the top of the page with:
1. Brief explanation: "Copy the playlist and import it into your music app"
2. Platform dropdown (Spotify, YTM, Apple Music, etc.)
3. "Copy & open Tune My Music" button
4. Step-by-step: "1. Click Copy, 2. Choose 'Free Text' as source, 3. Paste, 4. Select destination"

Collapsed by default after first visit (localStorage flag).

### 4. Route structure

**Decision**: `/session/:sessionId/tape/:tapeId/comment` — separate from session view. Back button returns to session view. Page renders outside Layout (no bottom nav, like create/join pages).

### 5. Comment submission — bulk insert

**Decision**: On submit, collect all non-empty comment fields and bulk insert into the comments table. One insert per comment (per-song + tape-level). Skip empty fields entirely.
