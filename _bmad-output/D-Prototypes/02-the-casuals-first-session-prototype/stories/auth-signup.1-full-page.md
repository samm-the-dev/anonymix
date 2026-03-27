# Story: Auth / Sign Up — Full Page

## Purpose
Account creation via music platform OAuth. One tap creates the account AND links the platform. Pick Spotify or YouTube Music — that's it.

## Specifications Reference
- `02.2-auth-sign-up.md` — Auth / Sign Up spec
- `Auth-SignUp-Work.yaml` — Section 1 definition

## Objects

### context-reminder
- **Type:** Display
- **Content:** Session name + "You're joining [session]" — reminds them what they're doing
- **Style:** Centered, above the buttons

### spotify-button
- **Type:** OAuth button
- **Content:** "Sign up with Spotify" with Spotify icon/color
- **Style:** Full-width, Spotify green (#1DB954), white text, rounded

### youtube-button
- **Type:** OAuth button
- **Content:** "Sign up with YouTube Music" with YT icon/color
- **Style:** Full-width, red (#FF0000), white text, rounded

### oauth-error
- **Type:** Error state
- **Content:** "Something went wrong. Try again." with retry option
- **Style:** Red text, subtle, below buttons. Hidden by default.

## HTML Structure

```
<div class="auth-page">
  <p>You're joining</p>
  <h1>Comic Book Fuckery</h1>
  <p class="subtext">Choose your music platform to get started</p>
  <button class="spotify">Sign up with Spotify</button>
  <button class="youtube">Sign up with YouTube Music</button>
  <p class="error hidden">Something went wrong. Try again.</p>
  <p class="footer">Your platform determines which catalog you search and where playlists are created.</p>
</div>
```

## Tailwind Classes

- **Page:** `max-w-[428px] mx-auto min-h-screen bg-white flex flex-col items-center justify-center px-6`
- **"You're joining":** `text-sm text-gray-400`
- **Session name:** `text-xl font-bold font-display text-gray-900 mt-1`
- **Subtext:** `text-sm text-gray-400 mt-6 mb-4`
- **Spotify button:** `w-full py-3 rounded-xl text-base font-semibold text-white text-center flex items-center justify-center gap-2` bg: #1DB954
- **YouTube button:** `w-full py-3 rounded-xl text-base font-semibold text-white text-center flex items-center justify-center gap-2 mt-3` bg: #FF0000
- **Error:** `text-sm text-red-500 mt-4 hidden`
- **Footer:** `text-xs text-gray-300 mt-6 text-center leading-relaxed`

## JavaScript Requirements

### Functions
- `loadAuthData()` — fetch demo-data.json for session name
- `renderAuthPage(data)` — populate session name
- `handleSpotifyAuth()` — simulate OAuth (log + show toast "Redirecting to Spotify...")
- `handleYouTubeAuth()` — simulate OAuth (log + show toast "Redirecting to YouTube Music...")

## Demo Data
- Session name from invite: Comic Book Fuckery

## Acceptance Criteria

### Agent-Verifiable
- [ ] "You're joining" + "Comic Book Fuckery" visible
- [ ] "Sign up with Spotify" button visible with green background
- [ ] "Sign up with YouTube Music" button visible with red background
- [ ] Subtext about choosing platform visible
- [ ] Footer about platform purpose visible
- [ ] Error state hidden by default
- [ ] Tapping Spotify button shows feedback
- [ ] Tapping YouTube button shows feedback
- [ ] No horizontal overflow at 375px

### User-Evaluable
- [ ] Two clear choices, no confusion
- [ ] Platform colors make buttons instantly recognizable
- [ ] Page feels simple — not a "signup form"
- [ ] Context reminder keeps them oriented
