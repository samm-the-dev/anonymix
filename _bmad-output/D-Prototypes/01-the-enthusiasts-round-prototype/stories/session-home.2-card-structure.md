# Story: Session Home — Section 2: Session Card Structure

**Status:** Complete
**Completed:** 2026-03-25
**Summary:** Session cards with title, description, avatars (no admin badge), tape title + prompt. Three-dot menu icon. Session description added below title per user feedback. Admin badge deferred to session members list.

## Purpose
Create the static session card layout with title, avatars, and tape prompt. No status colors or action buttons yet.

## Specifications Reference
- `01.1-session-home.md` — Session Home page spec
- `Session-Home-Work.yaml` — Section 2 definition
- `demo-data.json` — Player and session data

## Objects

### card-container
- **Type:** Container
- **Behavior:** Full-width rounded card within section content area
- **States:** Default only (status variants added in Section 3)

### card-header
- **Type:** Display row
- **Label:** Session title (left), drag handle icon (right)
- **Behavior:** Static display

### avatar-row
- **Type:** Display row
- **Behavior:** Overlapping circles, -8px margin overlap. Letter avatars with background color, or image avatars. Admin player gets small "Admin" badge below their avatar.
- **States:** Default only

### tape-prompt
- **Type:** Text display
- **Behavior:** Shows current/latest tape prompt, single line, ellipsis overflow
- **States:** Default only

## HTML Structure

```
<div class="session-card">                    <!-- card container -->
  <div class="card-header">
    <h3>Session Title</h3>                    <!-- session name -->
    <svg>⋮⋮</svg>                             <!-- drag handle / menu dots -->
  </div>
  <div class="avatar-row">
    <div class="avatar" style="bg-color">S</div>    <!-- letter avatar -->
    <div class="avatar"><img src="..." /></div>       <!-- image avatar -->
    <!-- "Admin" label under admin avatar -->
  </div>
  <p class="tape-prompt">Current tape prompt text...</p>
</div>
```

## Tailwind Classes

- **Card container:** `mx-4 my-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm`
- **Card header row:** `flex items-center justify-between mb-3`
- **Session title:** `text-base font-semibold text-gray-900`
- **Menu dots:** `w-5 h-5 text-gray-400`
- **Avatar row:** `flex items-end mb-3` (items-end to align admin badge)
- **Avatar circle:** `w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-white -ml-2 first:ml-0`
- **Avatar image:** `w-full h-full rounded-full object-cover`
- **Admin badge:** `text-[10px] text-gray-500 font-medium -mt-0.5` (centered under avatar)
- **Tape prompt:** `text-sm text-gray-500 truncate`

## JavaScript Requirements

### Functions
- `renderSessionCard(session, players)` — creates card HTML from session data
- `renderAvatarRow(playerIds, players, adminId)` — creates overlapping avatar circles with admin badge
- `loadDemoData()` — fetch and parse demo-data.json
- `renderSessions(data)` — populate Active and Completed sections with cards, update counts

### Data Flow
1. Fetch `data/demo-data.json` on load
2. Separate sessions into active (not ended) and completed (ended)
3. Render cards into respective section containers
4. Update section count badges

## Demo Data
- Active section: Comic Book Fuckery (1 card)
- Completed section: Playlist Pandamonium (1 card)
- Section counts update: Active (1), Completed (1)

## Acceptance Criteria

### Agent-Verifiable
- [ ] Two session cards rendered (one per section)
- [ ] Session titles display correctly
- [ ] 5 avatars per card with overlapping layout
- [ ] Admin badge visible under correct player (Sam for CBF, Brent for PP)
- [ ] Tape prompt text truncates with ellipsis if too long
- [ ] Section counts show (1) and (1)
- [ ] No horizontal overflow at 375px

### User-Evaluable
- [ ] Avatar overlap looks natural, not cluttered
- [ ] Card feels balanced — not too sparse, not too busy
- [ ] Admin badge is subtle but readable
- [ ] Tape prompt truncation feels right (not cutting too early)
