## Context

The app scaffold is complete with mock data rendering Session Home. Supabase SQL schema and seed files exist at `supabase/schema.sql` and `supabase/seed.sql`. The Supabase JS client is installed and a typed client exists at `src/lib/supabase.ts` but isn't consumed by any page yet. Manual database types are at `src/lib/database.types.ts`.

## Goals / Non-Goals

**Goals:**
- Live data from Supabase Postgres replacing mock data
- Real-time subscription so UI reflects tape status changes without refresh
- Clean data-fetching pattern that other pages can follow

**Non-Goals:**
- Auth or RLS (next change)
- Write operations / mutations
- Supabase Edge Functions

## Decisions

### 1. Query pattern — custom hook wrapping Supabase client

**Choice:** A `useSessionList` hook in `src/hooks/useSessionList.ts` that calls Supabase, manages loading/error state, and subscribes to real-time changes.

**Why over raw `supabase.from()` in the component:** Encapsulates the join logic (sessions → tapes → players → submissions/comments for action state) and real-time subscription lifecycle. Other pages can follow the same `use<Resource>` pattern.

**Why not a data-fetching library (React Query, SWR):** Supabase real-time subscriptions handle cache invalidation. Adding React Query on top is redundant for this use case. Can revisit if query complexity grows.

### 2. Join strategy — multiple queries, client-side assembly

**Choice:** Fetch sessions, then batch-fetch tapes and players for those sessions. Assemble the `SessionWithTape` shape client-side.

**Why:** Supabase's PostgREST supports embedded joins (`select('*, tapes(*)')`) but the session-players join table and the "active tape" selection logic make a single query unwieldy. Two-three simple queries composed client-side is clearer and easier to type.

**Alternative considered:** Postgres view or RPC function. Deferred — adds server-side complexity for a read that's simple enough client-side at this scale (5-50 sessions max).

### 3. Real-time scope — subscribe to tapes table only

**Choice:** Subscribe to `INSERT`, `UPDATE` on the `tapes` table. When a tape changes status or a new tape is created, refetch the full session list.

**Why:** Tape status transitions are the primary real-time event (submission closes → commenting opens → playlist ready → results). Session metadata (name, players) changes rarely and doesn't need real-time. Subscribing to one table keeps the subscription simple.

### 4. Dev user simulation — hardcoded player ID

**Choice:** A `DEV_USER_ID` constant set to Sam's player UUID from the seed data. Used to check submission/comment existence for action state.

**Why:** Auth isn't wired yet but the UI needs to know whether "you" have submitted/commented. Hardcoding Sam's ID from the seed data lets the action buttons show correct state. Replaced by real auth user ID in the next change.

### 5. Environment configuration — `.env.local` with `.env.example` template

**Choice:** Supabase URL and anon key in `.env.local` (git-ignored). A `.env.example` file checked in with placeholder values.

**Why:** Standard Vite env var pattern. The anon key is safe to expose client-side (it's a public key gated by RLS, which we'll add with auth).

## Risks / Trade-offs

- **[No RLS]** → During this change, the anon key has unrestricted read access to all tables. Acceptable for dev; auth change adds RLS policies.
- **[Refetch-on-change]** → Real-time triggers a full refetch rather than surgical cache update. Fine at this scale. If session counts grow, switch to incremental updates.
