# Story: Session View — Section 2: Active Tape Card Structure

**Status:** Complete
**Completed:** 2026-03-25
**Summary:** Cassette-ratio card with tape number, status badge, title/subtitle prompt, progress bar, user submission with Change link. Wait hint removed (redundant with progress bar). Compact spacing, visual weight compensates.

## Purpose
Build the active tape card in submitting state, matching the wireframe's cassette-ratio layout with all content elements.

## Specifications Reference
- `01.2-tape-list.md` — Tape List page spec
- `Sketches/session-view-wireframe.png` — Approved wireframe
- `Session-View-Work.yaml` — Section 2 definition

## Objects

### active-tape-card
- **Type:** Card container
- **Shape:** Landscape cassette ratio (~335w x 260h), rounded corners, shadow
- **States:** Submitting only (other states in Section 4)

### card-header
- **Type:** Display row
- **Layout:** "TAPE N" (left, uppercase, small, muted) | status badge + deadline (right)
- **States:** Submitting badge (green)

### prompt-text
- **Type:** Text display
- **Behavior:** 18px, left-aligned, the creative prompt. Can wrap to 2-3 lines.

### progress-bar
- **Type:** Display
- **Layout:** "X/Y submitted" text (green) above thin progress bar
- **Behavior:** Bar fills proportionally. Green fill, gray track.

### user-submission
- **Type:** Display row
- **Layout:** "Your pick" label (muted, small) above song — artist. "Change" link right-aligned.
- **Behavior:** Only shown if current user has submitted.

## HTML Structure

```
<div class="active-tape-card">
  <div class="card-header">
    <span>TAPE 2</span>
    <span class="badge">Submitting · 4d</span>
  </div>
  <p class="prompt">polarizing "love it or hate it" songs</p>
  <div class="progress">
    <span>1/5 submitted</span>
    <div class="bar"><div class="fill"></div></div>
  </div>
  <hr />
  <div class="submission">
    <div>
      <span class="label">Your pick</span>
      <span class="song">Dance Monkey — Tones and I</span>
    </div>
    <a class="change">Change</a>
  </div>
</div>
```

## Tailwind Classes

- **Card:** `bg-white rounded-2xl border border-gray-200 shadow-md p-5 w-full`
- **Card header row:** `flex items-center justify-between mb-4`
- **Tape label:** `text-xs font-semibold uppercase tracking-wider text-gray-400`
- **Status badge:** `text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700`
- **Prompt:** `text-lg font-medium text-gray-900 mb-4 leading-snug`
- **Progress text:** `text-xs font-medium text-green-600 mb-1`
- **Progress track:** `h-1 bg-gray-200 rounded-full overflow-hidden`
- **Progress fill:** `h-full bg-green-500 rounded-full transition-all`
- **Divider:** `border-t border-gray-100 my-4`
- **"Your pick" label:** `text-[11px] text-gray-400 uppercase tracking-wide mb-0.5`
- **Song text:** `text-sm font-medium text-gray-900`
- **Change link:** `text-sm font-medium text-blue-500`
- **Wait hint:** `text-xs text-gray-400 mt-3`

## JavaScript Requirements

### Functions
- `renderActiveTapeCard(tape, session, currentUser)` — builds the full card HTML
- `getSubmissionForUser(tape, userId)` — returns user's submission or null
- `formatCountdown(deadline)` — returns "Xd" or "Xd Xh" from deadline

### Data
- Use tape 2 from Comic Book Fuckery (Magneto — submitting, Sam has submitted "Dance Monkey")
- Progress: 1/5 submitted
- Waiting for: 4 more

## Acceptance Criteria

### Agent-Verifiable
- [ ] Card renders with landscape proportions (wider than tall)
- [ ] "TAPE 2" label visible top-left
- [ ] Green "Submitting" badge visible top-right with countdown
- [ ] Prompt text wraps naturally, 18px equivalent
- [ ] Progress bar shows 1/5 (20% fill, green)
- [ ] "Your pick" section shows Dance Monkey — Tones and I
- [ ] "Change" link visible right of submission
- [ ] "Waiting for 4 more" at bottom
- [ ] No horizontal overflow at 375px

### User-Evaluable
- [ ] Card proportions feel like a cassette lying in a crate
- [ ] Visual hierarchy reads naturally top to bottom
- [ ] Progress bar is thin but visible
- [ ] "Change" link is tappable at mobile size
