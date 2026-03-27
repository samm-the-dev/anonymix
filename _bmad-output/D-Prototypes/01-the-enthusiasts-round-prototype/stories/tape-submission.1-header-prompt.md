# Story: Tape Submission — Section 1: Header + Prompt + Deadline

## Purpose
Page shell with navigation, tape info header, prominent prompt display, and submission countdown.

## Specifications Reference
- `01.3-tape-submission.md` — Tape Submission spec
- `Sketches/tape-submission-wireframe.png` — Approved wireframe
- `Tape-Submission-Work.yaml` — Section 1 definition

## Objects

### submission-header
- **Type:** Navigation bar
- **Layout:** ← back (left) | "Tape N · Submit" + session name subtitle (center)
- **Behavior:** Back navigates to session-view.html

### tape-prompt
- **Type:** Text display
- **Layout:** Tape name (bold, large) + desc below (muted, smaller)
- **Behavior:** Static, prominent positioning below header

### deadline
- **Type:** Text display
- **Behavior:** Countdown in muted green: "1d 4h left to submit"

## Tailwind Classes

- **Header:** `px-4 py-3 border-b border-gray-200 relative flex items-center`
- **Back:** `w-8 text-gray-600`
- **Title:** `absolute left-1/2 -translate-x-1/2 text-center`
- **Title text:** `text-sm font-semibold font-display`
- **Subtitle:** `text-[11px] text-gray-400`
- **Prompt section:** `px-4 pt-5 pb-3`
- **Tape name:** `text-xl font-semibold font-display text-gray-900 leading-snug`
- **Tape desc:** `text-sm text-gray-400 mt-1`
- **Deadline:** `text-xs font-medium text-green-600 mt-2`

## JavaScript Requirements

### Functions
- `loadTapeData()` — fetch demo-data.json, get tape by URL param or default to active submitting tape
- `renderSubmissionHeader(tape, session)` — header with tape number and session name
- `renderPrompt(tape)` — name/desc display
- `formatDeadlineCountdown(deadline)` — "Xd Xh left to submit"

### URL Parameters
- `?session=comic-book-fuckery&tape=cbf-tape-2` — selects session and tape

## Demo Data
- Tape 2: Magneto (submitting, Sam has submitted)
- Or Tape 3: The Flash (submitting, no submissions yet)

## Acceptance Criteria

### Agent-Verifiable
- [ ] Header shows "Tape 2 · Submit" centered with "Comic Book Fuckery" subtitle
- [ ] Back button links to session-view.html
- [ ] Tape name displayed bold and large
- [ ] Tape desc displayed below in muted text
- [ ] Deadline countdown visible in green
- [ ] No horizontal overflow at 375px

### User-Evaluable
- [ ] Prompt feels prominent — the creative brief draws your eye
- [ ] Header is compact, doesn't compete with prompt
- [ ] Deadline is visible but not alarming
