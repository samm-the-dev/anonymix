## ADDED Requirements

### Requirement: Session document schema
The Convex schema SHALL define a `sessions` table with the following fields: `name` (string), `description` (string), `adminId` (reference to users), `playerIds` (array of user references), `ended` (boolean). Session documents SHALL be queryable by player membership.

#### Scenario: Session contains required fields
- **WHEN** a session document is created
- **THEN** it SHALL contain name, description, adminId, playerIds, and ended fields with correct types

### Requirement: Tape document schema
The Convex schema SHALL define a `tapes` table with the following fields: `sessionId` (reference to sessions), `title` (string), `prompt` (string), `status` (union: `submitting | commenting | playlist_ready | results`), `deadline` (optional number, epoch ms), `completedAt` (optional number, epoch ms).

#### Scenario: Tape status is a constrained union
- **WHEN** a tape document is created with a status value not in the union
- **THEN** Convex schema validation SHALL reject the document

#### Scenario: Tape references its parent session
- **WHEN** a tape document is created
- **THEN** its `sessionId` field SHALL reference a valid session document

### Requirement: Player document schema
The Convex schema SHALL define a `players` table with the following fields: `name` (string), `avatar` (string, emoji character), `avatarColor` (string, hex color). This represents the display profile, not auth identity.

#### Scenario: Player has display fields
- **WHEN** a player document is created
- **THEN** it SHALL contain name, avatar, and avatarColor fields

### Requirement: Query — list sessions for current user
A Convex query function SHALL return all sessions where the current user is a member, with each session's active tape (most urgent actionable tape, or most recent if none actionable). Results SHALL be sorted by active tape deadline ascending (soonest deadline first, no-deadline sessions last).

#### Scenario: User sees only their sessions
- **WHEN** the query is executed for a user who is a member of 2 out of 5 total sessions
- **THEN** only the 2 sessions containing that user's ID in playerIds SHALL be returned

#### Scenario: Sessions sorted by deadline urgency
- **WHEN** the user has sessions with tape deadlines of tomorrow, next week, and none
- **THEN** the sessions SHALL be returned in order: tomorrow, next week, no deadline

#### Scenario: Active tape selection
- **WHEN** a session has tapes with statuses [results, submitting, results]
- **THEN** the active tape SHALL be the one with status `submitting` (actionable over completed)

### Requirement: Query — user action state per tape
The query SHALL indicate whether the current user has completed the action for the active tape (submitted during submitting phase, commented during commenting phase).

#### Scenario: User has not yet submitted
- **WHEN** the active tape is in `submitting` status and the user has no submission
- **THEN** the action state SHALL indicate `not done`

#### Scenario: User has submitted
- **WHEN** the active tape is in `submitting` status and the user has a submission
- **THEN** the action state SHALL indicate `done`

### Requirement: Dev seed data
A seed script SHALL populate the Convex dev database with demo data matching the prototype's 6 status variants: submitting (not done), submitting (done), commenting (not done), commenting (done), playlist_ready, and results. Seed data SHALL include at least 2 sessions (1 active, 1 completed) with multiple players.

#### Scenario: Seed data covers all status variants
- **WHEN** the seed script runs against an empty Convex dev database
- **THEN** the database SHALL contain sessions and tapes covering all 4 tape statuses and both user-action-done states
