# Story: Session View — Section 5: Crate-Flip Interaction

**Status:** Complete
**Completed:** 2026-03-25
**Summary:** Tap spines, swipe, and arrow keys to navigate. Card enter animation (200ms). All spines shown — progressive height squish (4=half, 5=third, 6+=sliver) and continuous width narrowing (2% per step, floor 80%). Spine labels show tape number, name (truncated), status on far right.

## Purpose
Add navigation between tapes via tap and swipe. The signature interaction — flipping through tapes in a crate.

## Specifications Reference
- `01.2-tape-list.md` — "Scroll/swipe to flip through tapes (crate-flip animation)"
- `Session-View-Work.yaml` — Section 5 definition

## Interactions

### Tap Spine
- Tap any visible spine → that tape becomes the active card
- Spines re-render around the new active tape
- Transition: card cross-fades or slides (~200ms)

### Swipe Gesture
- Swipe up on card area → move to next tape (below)
- Swipe down on card area → move to previous tape (above)
- Minimum swipe distance: 30px to avoid accidental triggers
- Swipe direction matches physical metaphor: swipe up = dig deeper into crate

### Keyboard (desktop testing)
- Arrow up/down to navigate (convenience for dev)

## Animation
- Active card fades out + slight translate in swipe direction
- New card fades in from opposite direction
- Spines re-render immediately (no spine animation needed for prototype)
- Duration: 200ms ease-out

## CSS

```css
.tape-card-enter {
    animation: cardEnter 200ms ease-out;
}
@keyframes cardEnter {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
```

## JavaScript Requirements

### Functions
- `navigateToTape(newIndex)` — set activeTapeIndex, re-render crate with animation
- `handleSwipe(startY, endY)` — calculate direction, call navigateToTape
- `setupSwipeListeners()` — touchstart/touchend on crate area
- `setupSpineTapListeners()` — click handlers on spine elements
- `setupKeyboardNav()` — arrow key listeners

### State
- `activeTapeIndex` — already exists, just update and re-render
- Clamp to valid range (0 to tapes.length - 1)

### Restore real active tape detection
- Remove the demo "middle tape" override from Section 3
- Restore finding the actual active tape on load

## Acceptance Criteria

### Agent-Verifiable
- [ ] Tapping a spine changes the active card
- [ ] Swiping up on card navigates to next tape
- [ ] Swiping down on card navigates to previous tape
- [ ] Arrow keys navigate (up/down)
- [ ] Navigation clamps at first and last tape
- [ ] Card animates on transition
- [ ] Spines update correctly after navigation
- [ ] Active tape correctly detected on load (not forced to middle)

### User-Evaluable
- [ ] Flip feels physical — like browsing tapes in a crate
- [ ] Animation speed feels right (not too fast, not sluggish)
- [ ] Swipe sensitivity is comfortable
- [ ] No jarring layout shifts during transition
