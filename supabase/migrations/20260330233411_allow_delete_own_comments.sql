-- Allow players to delete their own comments (needed for comment editing flow)
create policy "delete own comments" on comments
  for delete using (player_id = current_player_id());
