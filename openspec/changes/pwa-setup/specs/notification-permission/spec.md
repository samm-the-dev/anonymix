## ADDED Requirements

### Requirement: Notification permission pre-prompt
After the user submits their first song, a custom UI prompt SHALL appear asking "Get notified when the tape is ready to listen?" with Allow and Not now options. This is NOT the browser's native permission dialog.

#### Scenario: First submission triggers prompt
- **WHEN** user submits their first song across any session
- **THEN** the notification pre-prompt SHALL appear

#### Scenario: User clicks Allow
- **WHEN** user clicks Allow on the pre-prompt
- **THEN** the browser's native notification permission dialog SHALL appear

#### Scenario: User clicks Not now
- **WHEN** user clicks Not now
- **THEN** the pre-prompt SHALL close without triggering the native dialog
- **AND** the prompt SHALL reappear after the next submission

### Requirement: Push subscription storage
When notification permission is granted, the app SHALL create a push subscription and store it in the `push_subscriptions` table with the player's ID, endpoint, and keys.

#### Scenario: Permission granted
- **WHEN** the browser grants notification permission
- **THEN** a push subscription SHALL be created and stored in the database

#### Scenario: Subscription already exists
- **WHEN** the player already has a subscription for this endpoint
- **THEN** the existing record SHALL be updated (upsert)
