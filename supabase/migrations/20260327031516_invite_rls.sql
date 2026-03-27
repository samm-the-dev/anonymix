-- Allow authenticated users to read any session (for invite landing pages)
-- The session list hook already filters to member-only sessions in the app
create policy "read any session for invite" on sessions
  for select using (auth.uid() is not null);

-- Allow authenticated users to read session_players for any session (invite page shows members)
create policy "read any session_players for invite" on session_players
  for select using (auth.uid() is not null);

-- Allow authenticated users to read tapes for any session (invite page shows tape previews)
create policy "read any tapes for invite" on tapes
  for select using (auth.uid() is not null);

-- Allow players to join sessions themselves (insert into session_players)
create policy "join session self" on session_players
  for insert with check (player_id = public.current_player_id());
