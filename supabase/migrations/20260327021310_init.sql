-- Anonymix initial schema

-- Tape status enum
create type tape_status as enum ('submitting', 'commenting', 'playlist_ready', 'results');

-- Players (display profiles, not auth identities)
create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar text not null,
  avatar_color text not null,
  created_at timestamptz default now()
);

-- Sessions (top-level groups)
create table sessions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  admin_id uuid not null references players(id),
  ended boolean not null default false,
  created_at timestamptz default now()
);

-- Session membership (many-to-many)
create table session_players (
  session_id uuid not null references sessions(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  primary key (session_id, player_id)
);

-- Tapes (rounds within a session)
create table tapes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  title text not null,
  prompt text not null,
  status tape_status not null default 'submitting',
  deadline timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Submissions (one per player per tape)
create table submissions (
  id uuid primary key default gen_random_uuid(),
  tape_id uuid not null references tapes(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  song_name text not null,
  created_at timestamptz default now(),
  unique (tape_id, player_id)
);

-- Comments
create table comments (
  id uuid primary key default gen_random_uuid(),
  tape_id uuid not null references tapes(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

-- Indexes
create index tapes_session_id_idx on tapes(session_id);
create index submissions_tape_id_idx on submissions(tape_id);
create index comments_tape_id_idx on comments(tape_id);

-- Row-Level Security
-- Enable RLS on all tables. Dev policies allow anon read.
-- Auth change will tighten to session-member-only access.
alter table players enable row level security;
alter table sessions enable row level security;
alter table session_players enable row level security;
alter table tapes enable row level security;
alter table submissions enable row level security;
alter table comments enable row level security;

create policy "anon read players" on players for select using (true);
create policy "anon read sessions" on sessions for select using (true);
create policy "anon read session_players" on session_players for select using (true);
create policy "anon read tapes" on tapes for select using (true);
create policy "anon read submissions" on submissions for select using (true);
create policy "anon read comments" on comments for select using (true);
