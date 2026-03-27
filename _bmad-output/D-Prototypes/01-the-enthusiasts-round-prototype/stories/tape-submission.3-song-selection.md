# Story: Tape Submission — Section 3: Song Selection + Preview

## Purpose
Tap an autocomplete result to select a song. Show preview with album art, display submit button. Two-stage: select then confirm.

## Objects

### song-preview
- **Type:** Display card
- **Layout:** Large album art placeholder (left) | song title + artist (right)
- **Behavior:** Appears after tapping a result. Replaces autocomplete dropdown.

### submit-button
- **Type:** Action button
- **Layout:** Full-width, green filled, "Submit" label
- **Behavior:** Appears with song preview. Tap to submit (shows confirmation, returns to session view).

## Tailwind Classes

- **Preview container:** `mx-4 mt-4 flex items-center gap-4`
- **Album art:** `w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0`
- **Song title:** `text-base font-semibold text-gray-900`
- **Artist:** `text-sm text-gray-400`
- **Submit button:** `mx-4 mt-4 w-auto py-2.5 rounded-xl text-sm font-semibold text-white text-center bg-green-500 hover:bg-green-600`

## Acceptance Criteria

- [ ] Tapping available result fills input, hides autocomplete, shows preview
- [ ] Preview shows album art placeholder, title, artist
- [ ] Submit button visible below preview
- [ ] Clearing input hides preview and submit button, returns to search
- [ ] Tapping unavailable result does nothing
- [ ] Submit button logs confirmation and shows toast
