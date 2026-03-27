-- Allow any authenticated user to read any player record.
-- Player data (name, avatar, color) is non-sensitive display info
-- needed for invite landing pages and session previews.
-- Replaces the session-mate-only read policy.
drop policy "read players" on players;

create policy "read players" on players
  for select using (auth.uid() is not null);
