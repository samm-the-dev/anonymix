## Context

The `insert submissions` RLS policy only checks `player_id = current_player_id()`. It does not validate tape status or session membership. A late-joining player submitted to a tape that had already closed, corrupting prod data.

The frontend compounds this: `activeTape` is derived from `tapes[activeTapeIdx]` where the index can shift when `fetchData()` re-orders the array, causing `handleSubmit` to reference the wrong tape.

Current insert policy ([add_auth.sql:107-108](supabase/migrations/20260327023238_add_auth.sql#L107-L108)):
```sql
create policy "insert submissions" on submissions
  for insert with check (player_id = current_player_id());
```

## Goals / Non-Goals

**Goals:**
- Server-side enforcement: submissions can only be inserted/updated when the tape is `submitting`
- Server-side enforcement: submitter must be a session member
- Frontend defense-in-depth: re-check tape status before insert, use stable tape ID reference

**Non-Goals:**
- Adding `joined_at` to `session_players`
- Changing tape lifecycle triggers
- Fixing existing prod data (manual SQL)

## Decisions

### 1. Subquery-based RLS policy (over helper function)

Replace the insert policy with a subquery that joins `tapes` to verify status:

```sql
create policy "insert submissions" on submissions
  for insert with check (
    player_id = current_player_id()
    and exists (
      select 1 from tapes
      where tapes.id = tape_id
        and tapes.status = 'submitting'
    )
    and is_session_member((select session_id from tapes where id = tape_id))
  );
```

**Why over a helper function**: The check is specific to submissions insert — a dedicated function would add indirection without reuse. The `is_session_member` helper already exists and handles the membership check.

**Also tighten update policy** with the same tape-status check so players can't edit submissions after the tape closes.

### 2. Pass tape ID from page context into handleSubmit

The SessionViewPage already knows which tape is active. Instead of relying on `tapes[activeTapeIdx]` at submit time (which can go stale), `handleSubmit` should capture the tape ID at the point the user opens the submission form. This is a simple refactor — the submission form already has access to `activeTape.id`, and the Supabase insert already uses it. The fix is ensuring the value doesn't change out from under the user between opening the form and clicking submit.

**Approach**: Capture `activeTape.id` into a ref or local variable when the search overlay opens, and use that captured value in the insert — not the live `activeTape` derived from the index.

### 3. Frontend toast on RLS rejection

If the insert fails (RLS blocks it because tape status changed), show a toast: "This tape is no longer accepting submissions" and refresh the data. No custom error parsing needed — any insert error on a submission is most likely a policy violation.

## Risks / Trade-offs

- **RLS subquery performance** → Negligible: the `tapes` lookup is by primary key, and submissions inserts are infrequent (a few per tape per session). No index needed beyond the existing PK.
- **Stale form state** → The ref-based tape ID capture means if the tape advances while the user has the search overlay open, their submit will fail server-side (RLS blocks it) and they'll get a clear error. This is the correct behavior.
- **Existing update policy** → Currently `using (player_id = current_player_id())`. Adding tape-status check means players can't update submissions after a tape moves to `playlist_ready`. This is intentional — submissions should be locked once the tape advances.
