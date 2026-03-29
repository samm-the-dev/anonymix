## ADDED Requirements

### Requirement: VAPID key configuration
The system SHALL use a VAPID key pair for Web Push. The public key SHALL be available as `VITE_VAPID_PUBLIC_KEY` env var for client-side subscription. The private key SHALL be stored as a Supabase secret `VAPID_PRIVATE_KEY`. A `VAPID_SUBJECT` secret SHALL contain a mailto: or https: URL identifying the application.

#### Scenario: Client subscribes with VAPID key
- **WHEN** a player grants notification permission
- **THEN** the service worker SHALL create a push subscription using the VAPID public key and store it in `push_subscriptions`

### Requirement: Push notification Edge Function
A Supabase Edge Function `send-push` SHALL accept a JSON payload with `session_id`, `title`, `body`, `url`, and optional `exclude_player_id`. It SHALL query `push_subscriptions` for all session members (excluding the sender) and send Web Push notifications. Failed subscriptions (410 Gone) SHALL be deleted from `push_subscriptions`.

#### Scenario: Lifecycle notification sent to all members
- **WHEN** the Edge Function is called for a session with 5 members and an exclude_player_id
- **THEN** Web Push SHALL be sent to 4 members' subscriptions

#### Scenario: Expired subscription cleaned up
- **WHEN** a push endpoint returns 410 Gone
- **THEN** the corresponding `push_subscriptions` row SHALL be deleted

### Requirement: Notification triggers via database
A Postgres trigger on `tapes` SHALL invoke the `send-push` Edge Function via `pg_net` on status changes:
1. To `submitting` — title: "New tape!", body: tape title
2. To `playlist_ready` — title: "Playlist ready!", body: tape title
3. To `results` — title: "Results are in!", body: tape title

The trigger SHALL exclude the player who caused the change from receiving the notification.

#### Scenario: New tape notification
- **WHEN** a tape transitions to `submitting`
- **THEN** a push notification SHALL be sent to all session members (excluding the actor) with title "New tape!"

#### Scenario: Results notification
- **WHEN** a tape transitions to `results`
- **THEN** a push notification SHALL be sent with title "Results are in!"

### Requirement: Service worker push handler
The service worker SHALL listen for `push` events and display a notification with the title and body from the push payload. Tapping the notification SHALL open the app and navigate to the URL from the notification data. The service worker SHALL use `injectManifest` mode from vite-plugin-pwa.

#### Scenario: Push event shows notification
- **WHEN** a push event arrives while the app is in the background
- **THEN** the service worker SHALL display a notification with the payload's title and body

#### Scenario: Notification click opens session
- **WHEN** user taps a notification with a session URL
- **THEN** the app SHALL open/focus and navigate to that URL
