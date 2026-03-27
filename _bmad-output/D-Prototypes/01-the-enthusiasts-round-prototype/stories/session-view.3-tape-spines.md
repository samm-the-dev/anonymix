# Story: Session View — Section 3: Tape Spines + Crate Depth

**Status:** Complete
**Completed:** 2026-03-25
**Summary:** Past/future spines with gentle narrowing (96%→92%→88%), uniform opacity (0.5), max 3 per side. Fixed card height (260px). Narrowing reduced per feedback — physical stack feel over UI hierarchy.

## Purpose
Add past and future tape spines above and below the active card to create the crate depth illusion — cassettes receding in a crate.

## Specifications Reference
- `01.2-tape-list.md` — Tape List page spec
- `Sketches/session-view-wireframe.png` — Approved wireframe
- `Session-View-Work.yaml` — Section 3 definition

## Objects

### past-spine
- **Type:** Display element
- **Behavior:** Thin rounded rectangles stacked above active card, progressively narrower and more faded as they recede. Centered label: "Tape N · Status"
- **Visual:** Each spine ~36px tall, ~90% width of the one below it, opacity fades from 0.5 (nearest) to 0.2 (furthest)

### future-spine
- **Type:** Display element
- **Behavior:** Same as past spines but below the active card. Peek out beneath.
- **Visual:** Same progressive narrowing and fade, but below

## HTML Structure

```
<div class="tape-crate">
  <!-- Past spines (furthest first, nearest last) -->
  <div class="spine past" style="width:75%; opacity:0.2">Tape 1 · Completed</div>
  <div class="spine past" style="width:85%; opacity:0.4">Tape 2 · Completed</div>

  <!-- Active card -->
  <div class="active-tape-card">...</div>

  <!-- Future spines (nearest first, furthest last) -->
  <div class="spine future" style="width:85%; opacity:0.4">Tape 4 · Upcoming</div>
  <div class="spine future" style="width:75%; opacity:0.2">Tape 5 · Upcoming</div>
</div>
```

## Tailwind Classes

- **Spine:** `mx-auto rounded-lg bg-gray-200 flex items-center justify-center`
- **Spine height:** `h-9` (36px)
- **Spine label:** `text-[11px] font-medium text-gray-400 font-display`
- **Spine margin:** `mb-1` between spines, `mb-2` before active card, `mt-2` after active card
- **Active card wrapper:** no change (existing from Section 2)

## JavaScript Requirements

### Functions
- `renderSpine(tape, widthPct, opacity)` — creates a single spine element
- `renderCrateWithSpines(session, activeTapeIndex, currentUser)` — renders full crate: past spines + active card + future spines
- `getSpineLabel(tape)` — returns "Tape N · Status" label
- `calculateSpineStyle(distanceFromActive)` — returns width% and opacity based on distance from active tape

### Spine Calculation
- Width: starts at 92% for nearest spine, decreases by 8% per step (min 60%)
- Opacity: starts at 0.5 for nearest, decreases by 0.15 per step (min 0.15)
- Max 3 spines shown per side (past/future)

## Demo Data
- Comic Book Fuckery: Tape 1 (commenting/active shown as card), Tapes 2-3 (submitting/upcoming as future spines)
- Active tape index determines which is the card vs spines
- Past tapes: none currently (tape 1 is first), but the rendering handles it

## Acceptance Criteria

### Agent-Verifiable
- [ ] Future spines render below active card
- [ ] Spines are progressively narrower
- [ ] Spines are progressively more faded
- [ ] Each spine shows "Tape N · Status" label
- [ ] Spines are horizontally centered
- [ ] Max 3 spines per side
- [ ] No horizontal overflow at 375px

### User-Evaluable
- [ ] Depth illusion feels like flipping through a crate
- [ ] Spines don't overwhelm the active card
- [ ] Labels are readable but subtle
- [ ] Spacing between spines and card feels natural
