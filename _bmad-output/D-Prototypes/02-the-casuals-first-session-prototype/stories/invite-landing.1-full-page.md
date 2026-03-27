# Story: Invite Landing — Full Page

## Purpose
Conversion page for new users arriving via invite link. Social proof sells it — friends' faces, fun prompts, one button. Must fit one mobile screen, no scroll.

## Specifications Reference
- `02.1-invite-landing.md` — Invite Landing spec
- `Invite-Landing-Work.yaml` — Section 1 definition

## Objects

### session-header
- **Type:** Display
- **Content:** Session name large and prominent
- **Style:** Centered, font-display

### invited-by
- **Type:** Display
- **Content:** "Sam invited you to join" — personal touch
- **Style:** Muted text below session name

### member-avatars
- **Type:** Display row
- **Content:** Overlapping circles of current members + count
- **Style:** Same avatar pattern as Session Home

### prompt-preview
- **Type:** Display list
- **Content:** 2-3 recent tape prompts showing the session's vibe
- **Style:** Compact, muted, maybe italicized or in quotes

### explainer
- **Type:** Display
- **Content:** One-liner explaining Anonymix for new users
- **Style:** Small, muted — doesn't compete with social proof

### join-button
- **Type:** CTA button
- **Content:** "Join Session" — full width, prominent
- **Style:** Filled green, large tap target

## HTML Structure

```
<div class="invite-page">
  <h1>Comic Book Fuckery</h1>
  <p>Sam invited you to join</p>
  <div class="avatars">...</div>
  <div class="prompts">
    <p>"songs that start in one style then switch..."</p>
    <p>"polarizing love it or hate it songs"</p>
  </div>
  <p class="explainer">Share songs around themed prompts with friends. Anonymous picks, real reactions.</p>
  <button>Join Session</button>
</div>
```

## Tailwind Classes

- **Page:** `max-w-[428px] mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6`
- **Session name:** `text-2xl font-bold font-display text-gray-900 text-center`
- **Invited by:** `text-sm text-gray-400 mt-1`
- **Avatar row:** `flex items-center justify-center mt-4`
- **Avatar:** `w-10 h-10 rounded-full -ml-2 first:ml-0 border-2 border-white`
- **Member count:** `text-xs text-gray-400 ml-2`
- **Prompt list:** `mt-5 space-y-1.5 text-center`
- **Prompt item:** `text-sm text-gray-500 italic`
- **Explainer:** `text-xs text-gray-400 mt-5 text-center leading-relaxed`
- **Join button:** `mt-6 w-full py-3 rounded-xl text-base font-semibold text-white bg-green-500 hover:bg-green-600`

## JavaScript Requirements

### Functions
- `loadInviteData()` — fetch demo-data.json
- `renderInvitePage(data)` — populate all elements

## Demo Data
- Session: Comic Book Fuckery, invited by Sam
- 4 members with avatars
- 3 recent prompts

## Acceptance Criteria

### Agent-Verifiable
- [ ] Session name "Comic Book Fuckery" visible and prominent
- [ ] "Sam invited you to join" visible
- [ ] 4 member avatars displayed
- [ ] 2-3 tape prompts visible
- [ ] Explainer text visible
- [ ] "Join Session" button visible and full-width
- [ ] No vertical scroll needed at 375px height
- [ ] No horizontal overflow at 375px

### User-Evaluable
- [ ] Page feels inviting, not overwhelming
- [ ] Social proof (avatars + prompts) communicates the vibe
- [ ] Join button is the obvious next action
- [ ] Explainer is helpful but not in the way
