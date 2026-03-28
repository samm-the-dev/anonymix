## Context

Tapes have a `status` enum (submitting → commenting → playlist_ready → results) and a nullable `deadline` timestamptz. Currently deadlines are set at session creation and status never changes. We need the lifecycle to actually work.

## Goals / Non-Goals

**Goals:**
- Deadline starts when first submission arrives (not at creation)
- pg_cron advances expired tapes every 30 minutes
- Host can force-close submissions immediately
- Realtime subscription picks up status changes so UI updates live

**Non-Goals:**
- commenting/results transitions (future changes)
- Push notifications
- Multiple simultaneous active tapes per session

## Decisions

### 1. Deadline set on first submission via database trigger

**Decision**: A Postgres trigger on `submissions` INSERT sets the tape's deadline to `now() + interval '{submitDays} days'` if the tape's deadline is currently null. This avoids client-side logic and race conditions.

**Problem**: The submit window duration (submitDays) is set at session creation time but not stored anywhere on the tape — it's only in the create form state. We need to store it.

**Solution**: Add a `submit_window_hours` column to tapes (integer, default 48). The trigger reads this to calculate the deadline. This is cleaner than hardcoding days.

### 2. pg_cron for auto-advance

**Decision**: Enable `pg_cron` extension. Create a cron job running every 30 minutes:
```sql
SELECT cron.schedule('advance-expired-tapes', '*/30 * * * *', $$
  UPDATE tapes SET status = 'playlist_ready'
  WHERE status = 'submitting' AND deadline IS NOT NULL AND deadline < now()
$$);
```

pg_cron runs as superuser so it bypasses RLS. The query is simple and idempotent.

### 3. Host close via direct status update

**Decision**: The host taps "Close submissions" → client calls `supabase.from('tapes').update({ status: 'playlist_ready' }).eq('id', tapeId)`. RLS already permits session admins to update tapes. No new endpoint needed.

### 4. Realtime picks up changes

**Decision**: The existing realtime subscription on `tapes` in `useSessionList` already refetches when tapes change. When pg_cron or the host updates the status, connected clients will see the change.

## Risks / Trade-offs

- **pg_cron availability** → Supabase free tier includes pg_cron. Needs to be enabled via migration.
- **30-minute granularity** → A tape could stay in `submitting` up to 30 min past deadline. Acceptable for a casual app. Client-side can also show "submissions closed" when deadline is past, even before cron runs.
- **Trigger on first submission** → If the trigger fails, deadline stays null and tape never auto-advances. Mitigation: host can always force-close.
