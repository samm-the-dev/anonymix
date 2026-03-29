## 1. Supabase Project Setup

- [ ] 1.1 Create Supabase project on supabase.com (free tier), note the project URL and anon key — [supabase-data-layer: Supabase client configuration]
- [ ] 1.2 Run `supabase/schema.sql` in the Supabase SQL Editor to create tables and enums — [session-data-model: Dev seed data]
- [ ] 1.3 Run `supabase/seed.sql` in the Supabase SQL Editor to populate demo data — [session-data-model: Dev seed data]
- [x] 1.4 Create `.env.example` with placeholder values and `.env.local` with real Supabase URL and anon key — [supabase-data-layer: Environment template]
  > NOTE: `.env.local` with real values must be created by the user after Supabase project setup.

## 2. Data Fetching Hook

- [x] 2.1 Create `src/hooks/useSessionList.ts` — fetch sessions with joined tapes, players, and user action state from Supabase. Return `{ sessions, loading, error }`. Use hardcoded `DEV_USER_ID` for action state checks. — [supabase-data-layer: Session list query hook]
- [x] 2.2 Add real-time subscription on `tapes` table — on INSERT/UPDATE, refetch session list. Clean up subscription on unmount. — [supabase-data-layer: Real-time subscription]
- [x] 2.3 Add `.env.local` to `.gitignore` if not already present — [supabase-data-layer: Environment template]

## 3. Wire Up Session Home

- [x] 3.1 Replace `useSessions()` mock hook in SessionHomePage with `useSessionList()` — render loading state, error state, and session data — [session-home-page: Session Home data source]
- [ ] 3.2 Verify Session Home renders seed data from Supabase matching the previous mock data display — [session-data-model: Seed data matches mock data]

## 4. Testing

- [ ] 4.1 Unit test `useSessionList` — mock Supabase client, verify loading/error/success states and subscription cleanup
- [x] 4.2 Verify existing SessionCard and StatusBadge tests still pass (no changes to components)
- [ ] 4.3 Manual verification: real-time update — change a tape status in Supabase dashboard, confirm UI updates without refresh
