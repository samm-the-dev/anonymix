## ADDED Requirements

### Requirement: Supabase client configuration
The app SHALL create a typed Supabase client using environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The client SHALL be a singleton exported from `src/lib/supabase.ts`.

#### Scenario: Client initializes with env vars
- **WHEN** the app starts with valid env vars in `.env.local`
- **THEN** the Supabase client SHALL connect to the configured project

#### Scenario: Missing env vars
- **WHEN** env vars are missing or empty
- **THEN** the app SHALL show a clear error rather than silently failing

### Requirement: Session list query hook
A `useSessionList` hook SHALL return all sessions with their active tape, player list, and user action state. The hook SHALL manage loading and error states.

#### Scenario: Successful fetch
- **WHEN** the hook mounts
- **THEN** it SHALL return `{ sessions, loading, error }` where sessions is an array of `SessionWithTape`

#### Scenario: Loading state
- **WHEN** the query is in flight
- **THEN** `loading` SHALL be `true` and `sessions` SHALL be `undefined`

#### Scenario: Error state
- **WHEN** the Supabase query fails
- **THEN** `error` SHALL contain the error message and `sessions` SHALL be `undefined`

### Requirement: Real-time subscription
The hook SHALL subscribe to changes on the `tapes` table. When a tape is inserted or updated, the hook SHALL refetch the session list.

#### Scenario: Tape status changes
- **WHEN** a tape's status is updated in the database
- **THEN** the UI SHALL reflect the new status without a page refresh

#### Scenario: Cleanup on unmount
- **WHEN** the component using the hook unmounts
- **THEN** the real-time subscription SHALL be removed

### Requirement: Environment template
A `.env.example` file SHALL exist with placeholder values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

#### Scenario: New developer setup
- **WHEN** a developer clones the repo
- **THEN** they SHALL find `.env.example` with instructions for obtaining their own values
