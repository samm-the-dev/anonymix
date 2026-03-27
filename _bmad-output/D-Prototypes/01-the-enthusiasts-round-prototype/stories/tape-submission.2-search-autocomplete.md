# Story: Tape Submission — Section 2: Search Input + Autocomplete

## Purpose
Search box with fake autocomplete that filters a demo song catalog as the user types.

## Specifications Reference
- `01.3-tape-submission.md` — Tape Submission spec
- `Sketches/tape-submission-wireframe.png` — Approved wireframe (mid-search state)
- `Tape-Submission-Work.yaml` — Section 2 definition

## Objects

### search-input
- **Type:** Text input
- **Layout:** Search icon (left) | text input | clear × button (right, visible when text present)
- **Behavior:** Filters demo songs on keyup. Shows autocomplete dropdown when results exist.
- **States:** Empty (placeholder "Search for a song..."), typing (results visible), no results

### autocomplete-results
- **Type:** Dropdown list
- **Layout:** Each row: album art placeholder (gray square) | song title + artist | availability badge
- **Behavior:** Scrollable if many results. Max ~5 visible without scroll. Tap a row to select (handled in Section 3).
- **Availability:** Songs not on all session platforms show "Not on YT Music" muted on right, row grayed out

## Demo Song Catalog
Add to demo-data.json — ~15 songs covering various search terms. Mix of available and unavailable:

```json
"songCatalog": [
  { "title": "Heroes", "artist": "David Bowie", "available": true },
  { "title": "Heroes (We Could Be)", "artist": "Alesso ft. Tove Lo", "available": true },
  { "title": "Hero", "artist": "Mariah Carey", "available": false, "unavailableOn": "YT Music" },
  { "title": "Holding Out for a Hero", "artist": "Bonnie Tyler", "available": true },
  { "title": "Hero", "artist": "Family of the Year", "available": true },
  { "title": "Paranoid Android", "artist": "Radiohead", "available": true },
  { "title": "Bohemian Rhapsody", "artist": "Queen", "available": true },
  { "title": "Dance Monkey", "artist": "Tones and I", "available": true },
  { "title": "Nights", "artist": "Frank Ocean", "available": true },
  { "title": "A Day in the Life", "artist": "The Beatles", "available": true },
  { "title": "Happiness Is a Warm Gun", "artist": "The Beatles", "available": true },
  { "title": "Polarize", "artist": "Twenty One Pilots", "available": true },
  { "title": "Love It If We Made It", "artist": "The 1975", "available": true },
  { "title": "Controversial", "artist": "Prince", "available": false, "unavailableOn": "YT Music" },
  { "title": "Hate Me", "artist": "Ellie Goulding", "available": true }
]
```

## Tailwind Classes

- **Search container:** `px-4 mt-2`
- **Input wrapper:** `relative flex items-center border border-gray-300 rounded-xl bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400`
- **Search icon:** `absolute left-3 w-4 h-4 text-gray-400`
- **Input:** `w-full pl-9 pr-9 py-2.5 text-sm rounded-xl outline-none bg-transparent`
- **Clear button:** `absolute right-3 w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer`
- **Results container:** `mx-4 mt-1 border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden max-h-[280px] overflow-y-auto`
- **Result row:** `flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0`
- **Result row (unavailable):** `opacity-40 cursor-not-allowed`
- **Album art placeholder:** `w-10 h-10 rounded bg-gray-200 flex-shrink-0`
- **Song title:** `text-sm font-medium text-gray-900`
- **Artist:** `text-xs text-gray-400`
- **Unavailable badge:** `text-[10px] text-gray-400 flex-shrink-0 ml-auto`

## JavaScript Requirements

### Functions
- `filterSongs(query)` — filter songCatalog by title or artist, case-insensitive
- `renderAutocomplete(results)` — render the dropdown with results
- `hideAutocomplete()` — hide dropdown
- `setupSearchListeners()` — keyup on input triggers filter, clear button resets

### Behavior
- Min 2 characters to trigger search
- Empty input hides autocomplete
- Clear (×) visible only when input has text
- Unavailable rows not clickable

## Acceptance Criteria

### Agent-Verifiable
- [ ] Search input renders with placeholder "Search for a song..."
- [ ] Typing "hero" shows 4-5 matching results
- [ ] Each result shows album art placeholder, title, artist
- [ ] Unavailable songs are grayed out with platform label
- [ ] Clear button appears when text is entered
- [ ] Clear button resets input and hides results
- [ ] No results shows empty state
- [ ] Results scroll if more than ~5

### User-Evaluable
- [ ] Search feels responsive (instant filter)
- [ ] Autocomplete dropdown feels native
- [ ] Unavailable songs are clearly different but not invisible
- [ ] Input focus styling is clear
