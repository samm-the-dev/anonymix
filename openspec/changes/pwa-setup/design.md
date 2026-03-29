## Context

Anonymix has no PWA infrastructure. Icons exist at `public/icons/` (192, 512, 512-maskable). The app uses Vite 7 + React 19. Supabase provides Realtime subscriptions which could power in-app notifications, and Web Push API requires a service worker — so PWA setup is a prerequisite for push notifications and future chat features.

The notification + chat pipeline: **PWA service worker** → **push subscription** → **Supabase Edge Function sends push** → **service worker shows notification**. This change builds the first two steps.

## Goals / Non-Goals

**Goals:**
- Installable PWA with manifest and service worker
- Smart install prompt (not intrusive, shown after engagement)
- Notification permission request at a natural moment
- Store push subscription in Supabase for future use
- Offline indicator

**Non-Goals:**
- Push notification sending (needs Edge Function + Web Push VAPID keys — separate change)
- Chat feature (separate, uses same notification infra)
- Full offline mode or background sync
- iOS-specific workarounds (iOS PWA limitations are real but not blocking)

## Decisions

### 1. vite-plugin-pwa for service worker

**Decision**: Use `vite-plugin-pwa` with `generateSW` strategy (Workbox). Handles manifest generation, service worker creation, and precaching automatically.

**Why**: Manual service worker is error-prone. The plugin integrates with Vite's build pipeline, handles cache busting, and supports `injectManifest` if we need custom SW logic later (for push handling).

**Config**:
- `registerType: 'autoUpdate'` — SW updates silently, no user prompt
- `workbox.runtimeCaching` — cache Deezer album art and API responses
- `manifest` — generated from config, not a static file

### 2. Install prompt timing

**Decision**: Capture the `beforeinstallprompt` event in a `useInstallPrompt` hook. Show the prompt as a dismissible banner at the bottom of the session home page, but only after the user has completed at least one action (submitted a song or left a comment). Track dismissal in localStorage.

**Why**: Prompting on first visit is hostile — the user hasn't decided the app is worth installing yet. After their first tape action, they've invested and are more likely to install. The session home page is the right location because that's where they return to between actions.

**Alternative**: Button in profile page. Rejected — too hidden, most users won't find it.

### 3. Notification permission timing

**Decision**: Request notification permission after the user submits their first song. Show a contextual prompt: "Get notified when the tape is ready to listen?" with Allow/Not now buttons. This is a custom UI prompt — clicking Allow triggers the browser's native permission dialog.

**Why**: The browser's native dialog is a one-shot opportunity (if denied, it's very hard to re-ask). By pre-prompting with our own UI, we can explain the value and only trigger the native dialog when the user is ready. Timing it after first submission means the user understands what "tape is ready" means.

**Storage**: Push subscription stored in a new `push_subscriptions` table: `player_id`, `endpoint`, `keys`, `created_at`. This table is ready for when we build the push sending Edge Function.

### 4. Offline indicator

**Decision**: A thin banner below the app bar: "You're offline" in muted text, shown/hidden based on `navigator.onLine` + `online`/`offline` events. No retry logic — just awareness.

**Why**: Users on mobile may lose connection. Without an indicator, they'll try to submit and get a confusing error. The banner sets expectations.

### 5. Push subscription table

**Decision**: New migration adding `push_subscriptions` table. Even though we're not sending pushes yet, storing the subscription at permission-grant time means the data is ready when we build the sending side.

**Schema**:
```sql
CREATE TABLE push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(player_id, endpoint)
);
```

## Risks / Trade-offs

- **iOS Safari PWA limitations**: No Web Push support on iOS until iOS 16.4+, and even then it's flaky. Mitigation: gracefully degrade — install prompt works, notifications silently skip on unsupported platforms.
- **Service worker caching**: Could serve stale content. Mitigation: `autoUpdate` strategy refreshes on navigation.
- **Notification permission denial**: If the user clicks "Block" on the native dialog, we can't re-ask. Mitigation: our custom pre-prompt catches "Not now" without triggering the native dialog.
