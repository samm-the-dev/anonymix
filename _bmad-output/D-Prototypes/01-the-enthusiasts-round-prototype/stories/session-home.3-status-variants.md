# Story: Session Home — Section 3: Status Variants + Action Row

**Status:** Complete
**Completed:** 2026-03-25
**Summary:** Action row with View/status badge/action button. 4 status colors. 6 variant cards (submit/change, comment/commented, listen, results). Commented is only muted state. Inline badge+deadline. Completed sessions hide tape info.

## Purpose
Add action row to session cards with status-colored action buttons, deadline text, and "View Session" button. Duplicate active session across all 4 statuses for visual testing. Sort active sessions by deadline ascending.

## Specifications Reference
- `01.1-session-home.md` — Session Home page spec
- `Session-Home-Work.yaml` — Section 3 definition

## Objects

### action-row
- **Type:** Interactive row
- **Layout:** [View Session] outlined left | status + deadline center | [Action] filled right
- **States:** 4 status variants with different colors and labels

## Status Variants

| Status | Accent | Button Label | Deadline Copy | Badge BG |
|---|---|---|---|---|
| submitting | green-500 | Submit | "due in X days" | green-100 text-green-700 |
| commenting | amber-500 | Comment | "due in X days" | amber-100 text-amber-700 |
| playlist_ready | blue-500 | Listen | "Playlist ready" | blue-100 text-blue-700 |
| results | purple-500 | Completed | "X ago" | purple-100 text-purple-700 |

## HTML Structure (appended inside card)

```
<div class="action-row">
  <button class="view-session">View Session</button>
  <div class="status-center">
    <span class="status-badge">● Commenting</span>
    <span class="deadline">due in 2 days</span>
  </div>
  <button class="action-btn">Comment</button>
</div>
```

## Tailwind Classes

- **Action row:** `flex items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-2`
- **View Session button:** `text-xs font-medium text-gray-500 border border-gray-300 rounded-full px-3 py-1.5 flex-shrink-0`
- **Status center:** `flex flex-col items-center text-center min-w-0`
- **Status badge:** `text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full` + status color classes
- **Deadline text:** `text-[11px] text-gray-400 mt-0.5`
- **Action button:** `text-xs font-semibold text-white rounded-full px-3 py-1.5 flex-shrink-0` + status accent bg

## JavaScript Requirements

### Functions
- `getStatusConfig(status)` — returns accent colors, label, badge classes for a status
- `formatDeadline(tape)` — returns human-readable deadline string
- `renderActionRow(session, tape)` — renders the action row HTML

### Demo Data Modification
- Clone Comic Book Fuckery into 4 variants with different active tape statuses
- Sort active sessions by deadline ascending
- Keep Playlist Pandamonium as single completed session

## Acceptance Criteria

### Agent-Verifiable
- [ ] 4 active session cards visible, one per status
- [ ] Each card has correct status color on badge and action button
- [ ] "View Session" outlined button on left of each card
- [ ] Status badge + deadline text centered
- [ ] Action button on right with correct label
- [ ] Active sessions sorted by deadline ascending
- [ ] Completed section shows Playlist Pandamonium with "Results" action
- [ ] No horizontal overflow at 375px

### User-Evaluable
- [ ] Status colors are distinct and readable
- [ ] Action row feels balanced (three columns)
- [ ] Deadline text is readable at small size
- [ ] Cards don't feel too tall with the added row
