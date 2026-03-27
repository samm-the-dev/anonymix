-- Link players to Supabase Auth
alter table players add column auth_id uuid unique references auth.users(id);

-- Drop old permissive policies
drop policy "anon read players" on players;
drop policy "anon read sessions" on sessions;
drop policy "anon read session_players" on session_players;
drop policy "anon read tapes" on tapes;
drop policy "anon read submissions" on submissions;
drop policy "anon read comments" on comments;

-- Helper: get the player id for the current auth user
create or replace function current_player_id()
returns uuid
language sql
stable
security definer
as $$
  select id from players where auth_id = auth.uid()
$$;

-- Helper: check if current user is a member of a session
create or replace function is_session_member(sid uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists(
    select 1 from session_players
    where session_id = sid
    and player_id = current_player_id()
  )
$$;

-- Players: users can read their own record and records of session-mates
create policy "read own player" on players
  for select using (auth_id = auth.uid());

create policy "read session-mate players" on players
  for select using (
    id in (
      select sp2.player_id from session_players sp1
      join session_players sp2 on sp1.session_id = sp2.session_id
      where sp1.player_id = current_player_id()
    )
  );

create policy "insert own player" on players
  for insert with check (auth_id = auth.uid());

create policy "update own player" on players
  for update using (auth_id = auth.uid());

-- Sessions: members only
create policy "read member sessions" on sessions
  for select using (is_session_member(id));

create policy "insert sessions" on sessions
  for insert with check (admin_id = current_player_id());

create policy "update own sessions" on sessions
  for update using (admin_id = current_player_id());

-- Session players: members can see membership, admins can manage
create policy "read session_players" on session_players
  for select using (is_session_member(session_id));

create policy "insert session_players" on session_players
  for insert with check (
    -- session admin can add members
    exists(
      select 1 from sessions
      where id = session_id
      and admin_id = current_player_id()
    )
  );

-- Tapes: session members only
create policy "read tapes" on tapes
  for select using (is_session_member(session_id));

create policy "insert tapes" on tapes
  for insert with check (
    exists(
      select 1 from sessions
      where id = session_id
      and admin_id = current_player_id()
    )
  );

create policy "update tapes" on tapes
  for update using (
    exists(
      select 1 from sessions
      where id = session_id
      and admin_id = current_player_id()
    )
  );

-- Submissions: session members read, own player writes
create policy "read submissions" on submissions
  for select using (
    is_session_member((select session_id from tapes where id = tape_id))
  );

create policy "insert submissions" on submissions
  for insert with check (player_id = current_player_id());

create policy "update own submissions" on submissions
  for update using (player_id = current_player_id());

-- Comments: session members read, own player writes
create policy "read comments" on comments
  for select using (
    is_session_member((select session_id from tapes where id = tape_id))
  );

create policy "insert comments" on comments
  for insert with check (player_id = current_player_id());
