## Why

Players have no way to learn about new tapes, playlist availability, or results without manually checking the app. Push notifications close the engagement loop — the #1 emotional goal from the trigger map ("I actually look forward to the new prompt dropping"). The existing `push_subscriptions` table and `useNotificationPermission` hook are ready but no delivery mechanism exists. This PR also fixes the dual-submitting bug, mobile download routing, and install prompt visibility.

## What Changes

- **Push notifications**: Web Push via VAPID keys and a Supabase Edge Function. Lifecycle events: new tape prompt, playlist ready, results ready.
- **Bug fix — dual submitting tapes**: Guard `advance_next_tape` trigger so it only advances when no tape in the session is currently `submitting`.
- **Install prompt reliability**: Surface install instructions on session home page, not gated on `beforeinstallprompt` event.
- **Download fix**: Playlist export MIME type changed so mobile browsers route to downloads folder instead of music app.

## Non-goals

- Chat or any new user-generated content channels
- Per-event notification preferences (all lifecycle notifications are on)
- Notification grouping or batching
- Offline push queuing

## Capabilities

### New Capabilities
- `push-notifications`: Web Push delivery via VAPID + Edge Function — subscription management, notification triggers, service worker push handler

### Modified Capabilities
- `session-data-model`: `advance_next_tape` trigger guard fix

## Impact

- **New Edge Function**: `send-push` for Web Push delivery
- **No new dependencies**: Web Push encryption implemented via Web Crypto API
- **Environment**: VAPID public/private key pair needed in Supabase secrets + `VITE_VAPID_PUBLIC_KEY` client env
- **Service worker**: Switch from `generateSW` to `injectManifest` for push handler
- **Modified files**: vite.config.ts, advance trigger migration, playlistExport.ts, SessionHomePage, useNotificationPermission
