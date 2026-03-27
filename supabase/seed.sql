-- Seed data matching the prototype's status variants
-- Runs automatically after migrations via `supabase db reset`

-- Players
insert into players (id, name, avatar, avatar_color) values
  ('00000000-0000-0000-0000-000000000001', 'Sam', '🎸', '#6366f1'),
  ('00000000-0000-0000-0000-000000000002', 'Alex', '🎧', '#f59e0b'),
  ('00000000-0000-0000-0000-000000000003', 'Jordan', '🎹', '#10b981'),
  ('00000000-0000-0000-0000-000000000004', 'Riley', '🎤', '#ef4444'),
  ('00000000-0000-0000-0000-000000000005', 'Casey', '🥁', '#8b5cf6'),
  ('00000000-0000-0000-0000-000000000006', 'Morgan', '🎺', '#ec4899');

-- Session 1: Active — submitting
insert into sessions (id, name, description, admin_id, ended) values
  ('10000000-0000-0000-0000-000000000001', 'Friday Night Vinyl', 'Weekly picks with the crew',
   '00000000-0000-0000-0000-000000000001', false);

insert into session_players (session_id, player_id) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006');

insert into tapes (id, session_id, title, prompt, status, deadline) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
   'Magneto, Master of Magnetism', 'polarizing "love it or hate it" songs',
   'submitting', now() + interval '3 days');

-- Sam has submitted for this tape
insert into submissions (tape_id, player_id, song_name) values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Radiohead - Creep');

-- Session 2: Active — commenting
insert into sessions (id, name, description, admin_id, ended) values
  ('10000000-0000-0000-0000-000000000002', 'Road Trip Jams', 'Songs for the open road',
   '00000000-0000-0000-0000-000000000003', false);

insert into session_players (session_id, player_id) values
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004');

insert into tapes (id, session_id, title, prompt, status, deadline) values
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
   'Two-Face aka Harvey Dent', 'songs that start in one style then switch halfway through',
   'commenting', now() + interval '1 day');

-- Sam has commented on this tape
insert into comments (tape_id, player_id, text) values
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001',
   'This one hits different on the second listen');

-- Session 3: Active — playlist ready
insert into sessions (id, name, description, admin_id, ended) values
  ('10000000-0000-0000-0000-000000000003', 'Deep Cuts Club', 'No singles allowed',
   '00000000-0000-0000-0000-000000000005', false);

insert into session_players (session_id, player_id) values
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006');

insert into tapes (id, session_id, title, prompt, status) values
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003',
   'Guilty pleasures', 'songs you''d never admit to loving',
   'playlist_ready');

-- Session 4: Active — results
insert into sessions (id, name, description, admin_id, ended) values
  ('10000000-0000-0000-0000-000000000004', 'Throwback Thursday', 'Nostalgia only',
   '00000000-0000-0000-0000-000000000002', false);

insert into session_players (session_id, player_id) values
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006');

insert into tapes (id, session_id, title, prompt, status, completed_at) values
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004',
   'Spider-Man, Your Friendly Neighborhood Web-Slinger', 'fun, youthful, upbeat bangers',
   'results', now() - interval '6 days');

-- Session 5: Completed
insert into sessions (id, name, description, admin_id, ended) values
  ('10000000-0000-0000-0000-000000000005', 'Summer 2025 Mix', 'The soundtrack to last summer',
   '00000000-0000-0000-0000-000000000001', true);

insert into session_players (session_id, player_id) values
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004');

insert into tapes (id, session_id, title, prompt, status, completed_at) values
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005',
   'Final Round', 'the song of the summer',
   'results', now() - interval '90 days');
