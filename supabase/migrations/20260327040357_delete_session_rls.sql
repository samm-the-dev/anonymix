-- Allow session admins to delete their sessions
-- Cascade handles tapes, submissions, comments, and session_players
create policy "delete own sessions" on sessions
  for delete using (admin_id = public.current_player_id());
