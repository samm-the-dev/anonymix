## MODIFIED Requirements

### Requirement: Session document schema
The Supabase Postgres schema SHALL define a `sessions` table with the following columns: `id` (uuid, PK), `name` (text, not null), `description` (text, not null, default ''), `admin_id` (uuid, FK to players), `ended` (boolean, not null, default false), `created_at` (timestamptz). Session membership SHALL be tracked via a separate `session_players` join table with composite PK `(session_id, player_id)`.

#### Scenario: Session contains required fields
- **WHEN** a session row is inserted
- **THEN** it SHALL contain name, description, admin_id, ended, and created_at with correct types

#### Scenario: Session membership is many-to-many
- **WHEN** a player joins a session
- **THEN** a row SHALL be inserted into `session_players` with session_id and player_id

### Requirement: Tape document schema
The Supabase Postgres schema SHALL define a `tapes` table with: `id` (uuid, PK), `session_id` (uuid, FK to sessions, cascade delete), `title` (text, not null), `prompt` (text, not null), `status` (tape_status enum: submitting, commenting, playlist_ready, results), `deadline` (timestamptz, nullable), `completed_at` (timestamptz, nullable), `created_at` (timestamptz).

#### Scenario: Tape status is a Postgres enum
- **WHEN** a tape is inserted with an invalid status value
- **THEN** Postgres SHALL reject the insert with a type error

#### Scenario: Tape cascades on session delete
- **WHEN** a session is deleted
- **THEN** all tapes in that session SHALL be deleted via cascade

### Requirement: Player document schema
The Supabase Postgres schema SHALL define a `players` table with: `id` (uuid, PK), `name` (text, not null), `avatar` (text, not null), `avatar_color` (text, not null), `auth_id` (uuid, unique, FK to auth.users, nullable), `created_at` (timestamptz).

#### Scenario: Player linked to auth user
- **WHEN** a player record is created during profile setup
- **THEN** the `auth_id` column SHALL reference the Supabase auth user's ID

### Requirement: Submission document schema
The Supabase Postgres schema SHALL define a `submissions` table with: `id` (uuid, PK), `tape_id` (uuid, FK to tapes, cascade delete), `player_id` (uuid, FK to players, cascade delete), `song_name` (text, not null), `artist_name` (text, not null, default ''), `created_at` (timestamptz). A unique constraint on `(tape_id, player_id)` SHALL enforce one submission per player per tape.

#### Scenario: One submission per player per tape
- **WHEN** a player tries to insert a second submission for the same tape
- **THEN** Postgres SHALL reject the insert with a unique violation

### Requirement: Query — list sessions for current user
A client-side query SHALL first fetch session IDs where the current player is a member (via `session_players`), then fetch those sessions with their tapes, membership, and submission/comment status. Results SHALL be sorted by active tape deadline ascending.

#### Scenario: Only member sessions returned
- **WHEN** a user queries their sessions
- **THEN** only sessions where they are in `session_players` SHALL be returned

### Requirement: Row-Level Security
All tables SHALL have RLS enabled. Policies SHALL enforce: authenticated users can read any player/session/tape/session_players (for invite previews), but can only write to their own data. Session admins can delete sessions. Players can join sessions and manage their own submissions/comments. Helper functions `current_player_id()` and `is_session_member()` SHALL use `set search_path = ''` and `security definer`.

#### Scenario: Non-member cannot write to session
- **WHEN** a non-admin user tries to insert a tape into a session they don't admin
- **THEN** the RLS policy SHALL reject the insert

## REMOVED Requirements

### Requirement: Convex schema definitions
**Reason**: Backend pivoted from Convex to Supabase. All Convex-specific schema definitions, query functions, and mutation functions are replaced by Supabase Postgres tables, RLS policies, and client-side queries.
**Migration**: All data model behavior is now defined via Supabase migrations in `supabase/migrations/`. Client queries use `@supabase/supabase-js`.
