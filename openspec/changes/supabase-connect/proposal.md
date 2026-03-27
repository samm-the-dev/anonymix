## Why

Session Home runs on mock data. The Supabase schema (`supabase/schema.sql`) and seed data (`supabase/seed.sql`) exist but aren't connected. Wiring the app to a real Supabase project replaces the mock layer with live Postgres queries and real-time subscriptions — the foundation that auth and all future features build on.

## What Changes

- **New:** Supabase project created on supabase.com (free tier), schema and seed data deployed
- **New:** Environment config (`.env.local`) with Supabase URL and anon key
- **Modified:** `useSessions` hook in SessionHomePage swapped from mock data to Supabase query
- **New:** Supabase query function for listing sessions with active tape and player data (replaces mock data module)
- **New:** Real-time subscription on sessions/tapes tables so the UI updates when tape status changes
- **Removed:** Mock data import from SessionHomePage (mock module kept for tests)

## Non-goals

- **Auth** — queries use no auth context yet. RLS policies are not enforced (anon key has full read access during dev). Auth is the next change.
- **Write operations** — no mutations (create session, submit song, etc.). Read-only queries.
- **Type generation** — manual types are sufficient for now. `supabase gen types` can replace them later.

## Capabilities

### New Capabilities

- `supabase-data-layer`: Supabase client configuration, session list query with joins, real-time subscription

### Modified Capabilities

- `session-data-model`: Schema deployed to Supabase, seed data populated (was local SQL files only)
- `session-home-page`: Consumes live Supabase data instead of mock data

## Impact

- **New env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (via `.env.local`)
- **External dependency:** Supabase Cloud project (free tier)
- **Modified files:** `src/pages/SessionHomePage.tsx`, `src/lib/supabase.ts`
