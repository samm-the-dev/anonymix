## 1. PWA Infrastructure

- [x] 1.1 Install `vite-plugin-pwa` and configure in `vite.config.ts`: manifest (name, icons, colors, display), `generateSW` strategy, `registerType: 'autoUpdate'`, runtime caching for album art
- [x] 1.2 Add PWA meta tags to `index.html`: theme-color, apple-mobile-web-app-capable, apple-touch-icon
- [x] 1.3 Register service worker via `vite-plugin-pwa` virtual module in app entry point — autoUpdate handles this

## 2. Install Prompt

- [x] 2.1 Create `useInstallPrompt` hook: capture `beforeinstallprompt` event, expose `canInstall` and `promptInstall` function, detect standalone mode
- [x] 2.2 Create install banner component: dismissible, shown at bottom of session home page
- [x] 2.3 Add install eligibility logic: only show after first tape action (check submissions/comments count), track dismissal in localStorage
- [x] 2.4 Add install banner to SessionHomePage

## 3. Offline Indicator

- [x] 3.1 Create `useOnlineStatus` hook: track `navigator.onLine` + online/offline events
- [x] 3.2 Create offline banner component: thin bar below app bar, "You're offline"
- [x] 3.3 Add offline banner to AppBar component

## 4. Notification Permission

- [x] 4.1 Migration: create `push_subscriptions` table (player_id, endpoint, p256dh, auth)
- [x] 4.2 Update `database.types.ts` with push_subscriptions table
- [x] 4.3 Push migration
- [x] 4.4 Create `useNotificationPermission` hook: check permission state, request permission, create push subscription, store in Supabase
- [x] 4.5 Create notification pre-prompt component: "Get notified when the tape is ready?" with Allow/Not now
- [x] 4.6 Trigger pre-prompt after first song submission (in SessionViewPage submit handler)

## 5. Verify & Commit

- [x] 5.1 Type check, test service worker registration, test install prompt, test offline indicator
- [ ] 5.2 Commit all changes
