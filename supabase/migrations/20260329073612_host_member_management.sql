-- Allow session admin to remove members (except themselves)
create policy "admin can remove members"
  on session_players for delete
  using (
    exists (
      select 1 from sessions
      where sessions.id = session_players.session_id
        and sessions.admin_id = current_player_id()
    )
    and player_id != current_player_id()
  );
