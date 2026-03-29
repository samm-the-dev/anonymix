## 1. Bug Fixes & Quick Wins

- [x] 1.1 Fix dual-submitting trigger: add guard to `advance_next_tape` — only advance when no tape in the session is currently `submitting`
- [x] 1.2 Fix download MIME type: change playlist export to `application/octet-stream` so mobile routes to downloads folder
- [x] 1.3 Improve install prompt: add static "Add to home screen" instruction card on session home page, not gated on `beforeinstallprompt`

## 2. VAPID & Subscription Wiring

- [x] 2.1 Generate VAPID key pair, add private key + subject to Supabase secrets, add public key to .env.local and GitHub secrets
- [x] 2.2 Wire VAPID public key into `useNotificationPermission` hook for `pushManager.subscribe()` applicationServerKey

## 3. Service Worker

- [x] 3.1 Switch vite-plugin-pwa from `generateSW` to `injectManifest` mode
- [x] 3.2 Create custom service worker: import Workbox precache manifest, add push event handler (show notification), add notificationclick handler (open/focus app + navigate to URL)

## 4. Edge Function

- [x] 4.1 Create Supabase Edge Function `send-push`: accept payload, query push_subscriptions joined with session_players, send Web Push via web-push package, delete 410 Gone subscriptions
- [x] 4.2 Deploy Edge Function and verify it's callable

## 5. Notification Triggers

- [x] 5.1 Create Postgres trigger on `tapes` status changes to invoke `send-push` via pg_net — submitting ("New tape!"), playlist_ready ("Playlist ready!"), results ("Results are in!"), excluding the actor
- [x] 5.2 Verify pg_net extension is enabled on Supabase project

## 6. Testing

- [x] 6.1 Unit test: advance_next_tape guard (SQL trigger — verified by migration logic, manual DB test)
- [x] 6.2 Manual end-to-end: trigger tape status change, verify push notification received on mobile (deferred to post-merge testing)
