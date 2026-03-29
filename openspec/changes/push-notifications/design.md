## Context

Anonymix has no push notification delivery. The `push_subscriptions` table and `useNotificationPermission` hook exist but nothing sends notifications. The `advance_next_tape` trigger can open two tapes simultaneously. Install prompts rely on unreliable browser heuristics.

## Goals / Non-Goals

**Goals:**
- Push notifications for tape lifecycle events (new tape, playlist ready, results)
- Fix dual-submitting bug
- Improve install prompt visibility
- Fix mobile download routing

**Non-Goals:**
- Chat, messaging, or new UGC channels
- Per-event notification preferences
- Notification grouping

## Decisions

### 1. Push notification architecture

```
Tape status change → Postgres trigger → pg_net HTTP call → Edge Function `send-push`
                                                            → query push_subscriptions for session members
                                                            → send Web Push via VAPID
                                                            → delete 410 Gone subscriptions
```

**Why pg_net over client-side?** Server-side keeps notification logic centralized. Works even when no clients are connected. Trigger fires on status change regardless of who caused it (host action, cron job, etc.).

### 2. VAPID keys

Generated once, stored as Supabase secrets (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`). Public key exposed via `VITE_VAPID_PUBLIC_KEY` for the client push subscription flow. The existing `useNotificationPermission` hook needs the VAPID key wired into `pushManager.subscribe()`.

### 3. Service worker push handler

vite-plugin-pwa's `generateSW` mode doesn't support custom push event handlers. Switch to `injectManifest` mode with a minimal custom service worker that:
- Imports the Workbox precache manifest
- Handles `push` events (show notification with title/body from payload)
- Handles `notificationclick` (open/focus app, navigate to session URL)

### 4. Edge Function `send-push`

Accepts: `{ session_id, title, body, url, exclude_player_id }`. Queries `push_subscriptions` joined with `session_players` to get all member subscriptions (excluding sender). Implements VAPID + RFC 8291 encryption directly via Web Crypto API (no external dependencies). Cleans up expired subscriptions (410 responses).

### 5. Notification triggers

Postgres trigger on `tapes` status changes:
- `→ submitting`: "New tape!" + tape title
- `→ playlist_ready`: "Playlist ready!" + tape title
- `→ results`: "Results are in!" + tape title

Excludes the player who caused the change (via `current_player_id()`) to avoid self-notifications.

### 6. Dual-submitting fix

Add guard to `advance_next_tape`: before advancing, check that no tape in the same session currently has `status = 'submitting'`. If one exists, skip advancement.

### 7. Download MIME type

Change playlist export MIME from `application/xspf+xml` to `application/octet-stream`. Mobile browsers will treat it as a generic download.

### 8. Install prompt

Add a static instruction card on session home page with platform-specific "Add to home screen" guidance (iOS: Share → Add to Home Screen, Android: menu → Install). Always visible, not gated on `beforeinstallprompt`. Complements the existing banner which only shows when the browser event fires.

## Risks / Trade-offs

- **pg_net fire-and-forget**: Failed push calls won't retry. Acceptable — push is best-effort by nature. → Mitigation: Edge Function logs failures for debugging.
- **injectManifest migration**: Requires a custom SW file and build config change. → Mitigation: Minimal SW, well-documented pattern.
- **Supabase free tier**: pg_net has 500K requests/month. Each tape status change × session members = 1 call to Edge Function (which fans out). Very comfortable at current scale.
