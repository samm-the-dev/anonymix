-- Tighten submissions RLS: require tape status = 'submitting' and session membership.
-- Previously only checked player_id, allowing inserts/updates to closed tapes.

-- Replace insert policy
drop policy "insert submissions" on submissions;
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

-- Replace update policy (using + with check to prevent tape_id reassignment across sessions)
drop policy "update own submissions" on submissions;
create policy "update own submissions" on submissions
  for update using (
    player_id = current_player_id()
    and exists (
      select 1 from tapes
      where tapes.id = tape_id
        and tapes.status = 'submitting'
    )
    and is_session_member((select session_id from tapes where id = tape_id))
  ) with check (
    player_id = current_player_id()
    and exists (
      select 1 from tapes
      where tapes.id = tape_id
        and tapes.status = 'submitting'
    )
    and is_session_member((select session_id from tapes where id = tape_id))
  );
