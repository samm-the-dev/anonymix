## MODIFIED Requirements

### Requirement: Dev seed data
The seed data SHALL be deployed to a live Supabase Postgres database via `supabase/seed.sql`. The seed data SHALL match the existing SQL file: 6 players, 5 sessions, 5 tapes covering all 4 status variants, 1 submission, 1 comment.

#### Scenario: Seed data deployed
- **WHEN** `schema.sql` and `seed.sql` are run in the Supabase SQL Editor
- **THEN** the database SHALL contain all seed records queryable via the Supabase client

#### Scenario: Seed data matches mock data
- **WHEN** the app renders with Supabase data
- **THEN** the Session Home page SHALL display the same sessions and status variants as the previous mock data
