-- Fix Supabase advisor warnings

-- 1. Pin search_path on helper functions
create or replace function current_player_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from public.players where auth_id = auth.uid()
$$;

create or replace function is_session_member(sid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(
    select 1 from public.session_players
    where session_id = sid
    and player_id = public.current_player_id()
  )
$$;

-- 2. Wrap auth.uid() in (select ...) for per-query evaluation
-- Drop the per-row policies on players
drop policy "read own player" on players;
drop policy "insert own player" on players;
drop policy "update own player" on players;

create policy "insert own player" on players
  for insert with check (auth_id = (select auth.uid()));

create policy "update own player" on players
  for update using (auth_id = (select auth.uid()));

-- 3. Merge the two permissive SELECT policies into one
drop policy "read session-mate players" on players;

create policy "read players" on players
  for select using (
    auth_id = (select auth.uid())
    or id in (
      select sp2.player_id from public.session_players sp1
      join public.session_players sp2 on sp1.session_id = sp2.session_id
      where sp1.player_id = public.current_player_id()
    )
  );
