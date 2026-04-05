-- Seed: hello world session with tapes in all 5 statuses
-- Source: supabase/seed-data/hello-world-session.json

-- Auth user for dev/preview (magic link, pre-confirmed)
-- Matches the shape GoTrue expects so signInWithOtp works against seeded user
insert into auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, aud, role,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change_token_current,
  email_change, email_change_confirm_status,
  phone_change, phone_change_token,
  reauthentication_token,
  is_sso_user, is_anonymous
)
values (
  '00000000-0000-0000-0000-000000000099',
  '00000000-0000-0000-0000-000000000000',
  'smarsh09@gmail.com',
  crypt('testpassword', gen_salt('bf')),
  now(),
  'authenticated', 'authenticated',
  '{"provider":"email","providers":["email"]}',
  jsonb_build_object(
    'sub', '00000000-0000-0000-0000-000000000099',
    'email', 'smarsh09@gmail.com',
    'email_verified', true,
    'phone_verified', false
  ),
  now(), now(),
  '', '',
  '', '',
  '', 0,
  '', '',
  '',
  false, false
);

insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
values (
  '00000000-0000-0000-0000-000000000099',
  '00000000-0000-0000-0000-000000000099',
  jsonb_build_object(
    'sub', '00000000-0000-0000-0000-000000000099',
    'email', 'smarsh09@gmail.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  '00000000-0000-0000-0000-000000000099',
  now(),
  now(),
  now()
);

-- Players (Sam linked to seed auth user)
insert into players (id, name, avatar, avatar_color, auth_id) values
  ('d65ea8f9-edf4-4474-aa03-ea5b9644284e', 'Sam', '🎺', '#6366f1', '00000000-0000-0000-0000-000000000099'),
  ('b39dc477-605d-4a0e-9ac3-90df78f0130b', 'Sammie', '🎶', '#10b981', null);

-- Session
insert into sessions (id, name, description, admin_id, ended, slug, created_at) values
  ('e446bc3c-40a6-40bf-9198-43a4cd67f77e', 'hello world', 'the first session for this app',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', false, 'hello-world-e446',
   '2026-03-29T02:56:07.478434+00:00');

-- Members
insert into session_players (session_id, player_id) values
  ('e446bc3c-40a6-40bf-9198-43a4cd67f77e', 'd65ea8f9-edf4-4474-aa03-ea5b9644284e'),
  ('e446bc3c-40a6-40bf-9198-43a4cd67f77e', 'b39dc477-605d-4a0e-9ac3-90df78f0130b');

-- Tapes: results → skipped → playlist_ready → submitting → upcoming
insert into tapes (id, session_id, title, prompt, status, deadline, submit_window_hours, comment_window_hours, created_at) values
  ('c320c8b5-0597-43ce-abe0-b0431a7ff050', 'e446bc3c-40a6-40bf-9198-43a4cd67f77e',
   'allow me to introduce myself', 'songs establishing identity',
   'results', now() - interval '2 days', 48, 120,
   '2026-03-29T02:56:07.783762+00:00'),
  ('ad2b5c85-9f07-4623-a960-50aafaaba86c', 'e446bc3c-40a6-40bf-9198-43a4cd67f77e',
   'and you are?', 'personally inquisitive songs',
   'skipped', null, 48, 120,
   '2026-03-29T02:56:07.930365+00:00'),
  ('39a36854-75af-47f1-b777-2e2bc1653e77', 'e446bc3c-40a6-40bf-9198-43a4cd67f77e',
   'nice to meet you', 'songs about new friendship',
   'playlist_ready', now() + interval '5 days', 48, 120,
   '2026-03-29T02:56:08.063361+00:00'),
  ('8d48064d-396f-4abf-b8ff-927602d8d006', 'e446bc3c-40a6-40bf-9198-43a4cd67f77e',
   'let''s fucking go', 'songs about starting something exciting',
   'submitting', null, 48, 120,
   '2026-03-29T02:56:08.19257+00:00'),
  ('65a7f09e-112a-496c-a7b2-da6a7f57e697', 'e446bc3c-40a6-40bf-9198-43a4cd67f77e',
   'we did it', 'songs about accomplishing something',
   'upcoming', null, 48, 120,
   '2026-03-29T02:56:08.308829+00:00');

-- Submissions (deezer_id = former musicbrainz_id column)
insert into submissions (id, tape_id, player_id, song_name, artist_name, deezer_id, cover_art_url, created_at) values
  ('44c82eff-b125-4d51-9b29-858794552c03', 'c320c8b5-0597-43ce-abe0-b0431a7ff050',
   'b39dc477-605d-4a0e-9ac3-90df78f0130b', 'Sympathy For The Devil', 'The Rolling Stones',
   '9956063', 'https://cdn-images.dzcdn.net/images/cover/007ca308040f3efeff845f2fb4e87a2a/250x250-000000-80-0-0.jpg',
   '2026-03-29T03:09:34.788129+00:00'),
  ('f33e3bcb-04e8-469c-8f6d-c62fb6f3544d', 'c320c8b5-0597-43ce-abe0-b0431a7ff050',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'My Name Is', 'Eminem',
   '1109729', 'https://cdn-images.dzcdn.net/images/cover/e2b36a9fda865cb2e9ed1476b6291a7d/250x250-000000-80-0-0.jpg',
   '2026-03-29T03:10:10.087823+00:00'),
  ('21ff7cc9-74b2-490b-b286-85438ed92ace', '39a36854-75af-47f1-b777-2e2bc1653e77',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'My Best Friend', 'Weezer',
   '79779244', 'https://cdn-images.dzcdn.net/images/cover/03c500903d0504fd7939c4168b6cce89/250x250-000000-80-0-0.jpg',
   '2026-03-29T04:48:03.500848+00:00'),
  ('9a1bba6e-7dff-474e-9f18-3812cbdb188a', '39a36854-75af-47f1-b777-2e2bc1653e77',
   'b39dc477-605d-4a0e-9ac3-90df78f0130b', 'Nice to Meet You', 'Imagine Dragons',
   '2857441232', 'https://cdn-images.dzcdn.net/images/cover/4a3e5538d0d0caa37a76de4a34266191/250x250-000000-80-0-0.jpg',
   '2026-03-29T04:48:25.500067+00:00');

-- Comments
insert into comments (id, tape_id, player_id, text, submission_id, created_at) values
  ('789cc604-67cc-4e01-b057-11c324e63c10', 'c320c8b5-0597-43ce-abe0-b0431a7ff050',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', '🔥💯👏🙌🤌', null,
   '2026-03-29T04:29:09.447695+00:00'),
  ('a16b34c6-e9ef-478d-8837-d429facdbce3', 'c320c8b5-0597-43ce-abe0-b0431a7ff050',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', '🤯🥴😮‍💨💿🤌',
   '44c82eff-b125-4d51-9b29-858794552c03',
   '2026-03-29T04:29:09.447695+00:00'),
  ('2cce6a46-5e98-4944-bfd7-6963444f5a82', 'c320c8b5-0597-43ce-abe0-b0431a7ff050',
   'b39dc477-605d-4a0e-9ac3-90df78f0130b', 'HELL yeah',
   'f33e3bcb-04e8-469c-8f6d-c62fb6f3544d',
   '2026-03-29T04:30:28.971914+00:00'),
  ('e5760f84-cb69-4530-96e6-5e0c79c5dadf', 'c320c8b5-0597-43ce-abe0-b0431a7ff050',
   'b39dc477-605d-4a0e-9ac3-90df78f0130b', 'great mix! 🎶⚡', null,
   '2026-03-29T04:30:28.971914+00:00'),
  ('d68a7ebb-44e2-4cbc-a3c2-d9f458c7845f', '39a36854-75af-47f1-b777-2e2bc1653e77',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', '🙌🔥💯',
   '21ff7cc9-74b2-490b-b286-85438ed92ace',
   '2026-03-29T04:56:45.413545+00:00'),
  ('8c4d9756-7eeb-49c0-9add-e6a953c5cef3', '39a36854-75af-47f1-b777-2e2bc1653e77',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'hah how appropriate 😂',
   '9a1bba6e-7dff-474e-9f18-3812cbdb188a',
   '2026-03-29T04:56:45.413545+00:00'),
  ('4c26dc6d-df40-4dd1-9571-ddaac014af2c', '39a36854-75af-47f1-b777-2e2bc1653e77',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'very nice', null,
   '2026-03-29T04:56:45.413545+00:00');

-- =============================================================================
-- Seed: summer mixtape — completed session with 6 players, varied engagement
-- =============================================================================

-- New players (NPC — no auth users)
insert into players (id, name, avatar, avatar_color, auth_id) values
  ('a1b2c3d4-1111-4000-8000-000000000001', 'Jules', '🎸', '#f59e0b', null),
  ('a1b2c3d4-2222-4000-8000-000000000002', 'Mika', '🎧', '#ec4899', null),
  ('a1b2c3d4-3333-4000-8000-000000000003', 'Rio', '🥁', '#f97316', null),
  ('a1b2c3d4-4444-4000-8000-000000000004', 'Dani', '🎤', '#8b5cf6', null);

-- Session (completed)
insert into sessions (id, name, description, admin_id, ended, slug, created_at, completed_at) values
  ('b0b0b0b0-cafe-4000-8000-000000000001', 'summer mixtape', 'songs for the longest days',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', true, 'summer-mixtape-b0b0',
   '2026-03-25T12:00:00+00:00', '2026-03-31T20:00:00+00:00');

-- Members (all 6 players)
insert into session_players (session_id, player_id) values
  ('b0b0b0b0-cafe-4000-8000-000000000001', 'd65ea8f9-edf4-4474-aa03-ea5b9644284e'),
  ('b0b0b0b0-cafe-4000-8000-000000000001', 'b39dc477-605d-4a0e-9ac3-90df78f0130b'),
  ('b0b0b0b0-cafe-4000-8000-000000000001', 'a1b2c3d4-1111-4000-8000-000000000001'),
  ('b0b0b0b0-cafe-4000-8000-000000000001', 'a1b2c3d4-2222-4000-8000-000000000002'),
  ('b0b0b0b0-cafe-4000-8000-000000000001', 'a1b2c3d4-3333-4000-8000-000000000003'),
  ('b0b0b0b0-cafe-4000-8000-000000000001', 'a1b2c3d4-4444-4000-8000-000000000004');

-- Tapes: 4 results + 1 skipped
insert into tapes (id, session_id, title, prompt, status, deadline, submit_window_hours, comment_window_hours, created_at, completed_at) values
  ('a0a0a0a0-0001-4000-8000-000000000001', 'b0b0b0b0-cafe-4000-8000-000000000001',
   'opening track', 'songs that should start every playlist',
   'results', '2026-03-27T12:00:00+00:00', 48, 120,
   '2026-03-25T12:05:00+00:00', '2026-03-27T12:00:00+00:00'),
  ('a0a0a0a0-0002-4000-8000-000000000002', 'b0b0b0b0-cafe-4000-8000-000000000001',
   'guilty pleasures', 'songs you''d never admit to loving',
   'results', '2026-03-28T12:00:00+00:00', 48, 120,
   '2026-03-25T12:10:00+00:00', '2026-03-28T12:00:00+00:00'),
  ('a0a0a0a0-0003-4000-8000-000000000003', 'b0b0b0b0-cafe-4000-8000-000000000001',
   'main character energy', 'songs that make you feel unstoppable',
   'results', '2026-03-29T12:00:00+00:00', 48, 120,
   '2026-03-25T12:15:00+00:00', '2026-03-29T12:00:00+00:00'),
  ('a0a0a0a0-0004-4000-8000-000000000004', 'b0b0b0b0-cafe-4000-8000-000000000001',
   'the closer', 'perfect last song of the night',
   'results', '2026-03-30T12:00:00+00:00', 48, 120,
   '2026-03-25T12:20:00+00:00', '2026-03-30T12:00:00+00:00'),
  ('a0a0a0a0-0005-4000-8000-000000000005', 'b0b0b0b0-cafe-4000-8000-000000000001',
   'bonus round', 'wildcard — anything goes',
   'skipped', null, 48, 120,
   '2026-03-25T12:25:00+00:00', '2026-03-31T20:00:00+00:00');

-- Submissions
-- Tape 1 "opening track": Sam, Jules, Mika, Dani (4 submissions)
-- Tape 2 "guilty pleasures": Sam, Sammie, Jules, Dani (4 submissions)
-- Tape 3 "main character energy": Sam, Jules, Mika, Rio, Dani (5 submissions)
-- Tape 4 "the closer": Sam, Jules, Rio, Dani (4 submissions)
-- Tape 5 "bonus round": skipped — no submissions
insert into submissions (id, tape_id, player_id, song_name, artist_name, deezer_id, cover_art_url, created_at) values
  -- Tape 1
  ('50505050-0101-4000-8000-000000000001', 'a0a0a0a0-0001-4000-8000-000000000001',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'Don''t Stop Me Now', 'Queen',
   '7108411', 'https://cdn-images.dzcdn.net/images/cover/b6e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0/250x250-000000-80-0-0.jpg',
   '2026-03-25T14:00:00+00:00'),
  ('50505050-0102-4000-8000-000000000002', 'a0a0a0a0-0001-4000-8000-000000000001',
   'a1b2c3d4-1111-4000-8000-000000000001', 'Intro', 'The xx',
   '6282396', 'https://cdn-images.dzcdn.net/images/cover/a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1/250x250-000000-80-0-0.jpg',
   '2026-03-25T14:10:00+00:00'),
  ('50505050-0103-4000-8000-000000000003', 'a0a0a0a0-0001-4000-8000-000000000001',
   'a1b2c3d4-2222-4000-8000-000000000002', 'Baba O''Riley', 'The Who',
   '15713', 'https://cdn-images.dzcdn.net/images/cover/c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2/250x250-000000-80-0-0.jpg',
   '2026-03-25T14:20:00+00:00'),
  ('50505050-0104-4000-8000-000000000004', 'a0a0a0a0-0001-4000-8000-000000000001',
   'a1b2c3d4-4444-4000-8000-000000000004', 'Welcome to the Jungle', 'Guns N'' Roses',
   '1045498', 'https://cdn-images.dzcdn.net/images/cover/d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3/250x250-000000-80-0-0.jpg',
   '2026-03-25T14:30:00+00:00'),
  -- Tape 2
  ('50505050-0201-4000-8000-000000000005', 'a0a0a0a0-0002-4000-8000-000000000002',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', '...Baby One More Time', 'Britney Spears',
   '540938', 'https://cdn-images.dzcdn.net/images/cover/e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4/250x250-000000-80-0-0.jpg',
   '2026-03-26T14:00:00+00:00'),
  ('50505050-0202-4000-8000-000000000006', 'a0a0a0a0-0002-4000-8000-000000000002',
   'b39dc477-605d-4a0e-9ac3-90df78f0130b', 'MMMBop', 'Hanson',
   '1033566', 'https://cdn-images.dzcdn.net/images/cover/f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5/250x250-000000-80-0-0.jpg',
   '2026-03-26T14:10:00+00:00'),
  ('50505050-0203-4000-8000-000000000007', 'a0a0a0a0-0002-4000-8000-000000000002',
   'a1b2c3d4-1111-4000-8000-000000000001', 'Call Me Maybe', 'Carly Rae Jepsen',
   '15866788', 'https://cdn-images.dzcdn.net/images/cover/a6a6a6a6a6a6a6a6a6a6a6a6a6a6a6a6/250x250-000000-80-0-0.jpg',
   '2026-03-26T14:20:00+00:00'),
  ('50505050-0204-4000-8000-000000000008', 'a0a0a0a0-0002-4000-8000-000000000002',
   'a1b2c3d4-4444-4000-8000-000000000004', 'Wannabe', 'Spice Girls',
   '590414', 'https://cdn-images.dzcdn.net/images/cover/b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7/250x250-000000-80-0-0.jpg',
   '2026-03-26T14:30:00+00:00'),
  -- Tape 3
  ('50505050-0301-4000-8000-000000000009', 'a0a0a0a0-0003-4000-8000-000000000003',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'Lose Yourself', 'Eminem',
   '1109731', 'https://cdn-images.dzcdn.net/images/cover/c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8/250x250-000000-80-0-0.jpg',
   '2026-03-27T14:00:00+00:00'),
  ('50505050-0302-4000-8000-000000000010', 'a0a0a0a0-0003-4000-8000-000000000003',
   'a1b2c3d4-1111-4000-8000-000000000001', 'Run the World (Girls)', 'Beyoncé',
   '12435774', 'https://cdn-images.dzcdn.net/images/cover/d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9/250x250-000000-80-0-0.jpg',
   '2026-03-27T14:10:00+00:00'),
  ('50505050-0303-4000-8000-000000000011', 'a0a0a0a0-0003-4000-8000-000000000003',
   'a1b2c3d4-2222-4000-8000-000000000002', 'Stronger', 'Kanye West',
   '1135060', 'https://cdn-images.dzcdn.net/images/cover/e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0/250x250-000000-80-0-0.jpg',
   '2026-03-27T14:20:00+00:00'),
  ('50505050-0304-4000-8000-000000000012', 'a0a0a0a0-0003-4000-8000-000000000003',
   'a1b2c3d4-3333-4000-8000-000000000003', 'Eye of the Tiger', 'Survivor',
   '904187', 'https://cdn-images.dzcdn.net/images/cover/f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1/250x250-000000-80-0-0.jpg',
   '2026-03-27T14:30:00+00:00'),
  ('50505050-0305-4000-8000-000000000013', 'a0a0a0a0-0003-4000-8000-000000000003',
   'a1b2c3d4-4444-4000-8000-000000000004', 'Power', 'Kanye West',
   '6606498', 'https://cdn-images.dzcdn.net/images/cover/a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2/250x250-000000-80-0-0.jpg',
   '2026-03-27T14:40:00+00:00'),
  -- Tape 4
  ('50505050-0401-4000-8000-000000000014', 'a0a0a0a0-0004-4000-8000-000000000004',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'Last Nite', 'The Strokes',
   '1238418', 'https://cdn-images.dzcdn.net/images/cover/b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3/250x250-000000-80-0-0.jpg',
   '2026-03-28T14:00:00+00:00'),
  ('50505050-0402-4000-8000-000000000015', 'a0a0a0a0-0004-4000-8000-000000000004',
   'a1b2c3d4-1111-4000-8000-000000000001', 'Everlong', 'Foo Fighters',
   '1177160', 'https://cdn-images.dzcdn.net/images/cover/c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4/250x250-000000-80-0-0.jpg',
   '2026-03-28T14:10:00+00:00'),
  ('50505050-0403-4000-8000-000000000016', 'a0a0a0a0-0004-4000-8000-000000000004',
   'a1b2c3d4-3333-4000-8000-000000000003', 'Purple Rain', 'Prince',
   '686576', 'https://cdn-images.dzcdn.net/images/cover/d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5d5/250x250-000000-80-0-0.jpg',
   '2026-03-28T14:20:00+00:00'),
  ('50505050-0404-4000-8000-000000000017', 'a0a0a0a0-0004-4000-8000-000000000004',
   'a1b2c3d4-4444-4000-8000-000000000004', 'Heroes', 'David Bowie',
   '2271538', 'https://cdn-images.dzcdn.net/images/cover/e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6/250x250-000000-80-0-0.jpg',
   '2026-03-28T14:30:00+00:00');

-- Comments
-- Sam: 11 comments (power user), Jules: 4, Dani: 4, Sammie: 2, Mika: 2, Rio: 0 (lurker)
insert into comments (id, tape_id, player_id, text, submission_id, created_at) values
  -- Tape 1 comments (5)
  ('c0c0c0c0-0001-4000-8000-000000000001', 'a0a0a0a0-0001-4000-8000-000000000001',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'absolute banger to kick things off 🔥',
   '50505050-0102-4000-8000-000000000002',
   '2026-03-27T13:00:00+00:00'),
  ('c0c0c0c0-0002-4000-8000-000000000002', 'a0a0a0a0-0001-4000-8000-000000000001',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'welcome to the JUNGLE 🤘',
   '50505050-0104-4000-8000-000000000004',
   '2026-03-27T13:05:00+00:00'),
  ('c0c0c0c0-0003-4000-8000-000000000003', 'a0a0a0a0-0001-4000-8000-000000000001',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'great first round everyone', null,
   '2026-03-27T13:10:00+00:00'),
  ('c0c0c0c0-0004-4000-8000-000000000004', 'a0a0a0a0-0001-4000-8000-000000000001',
   'a1b2c3d4-1111-4000-8000-000000000001', 'classic choice Sam 👏',
   '50505050-0101-4000-8000-000000000001',
   '2026-03-27T13:15:00+00:00'),
  ('c0c0c0c0-0005-4000-8000-000000000005', 'a0a0a0a0-0001-4000-8000-000000000001',
   'a1b2c3d4-4444-4000-8000-000000000004', 'loved all the picks this round', null,
   '2026-03-27T13:20:00+00:00'),
  -- Tape 2 comments (6)
  ('c0c0c0c0-0006-4000-8000-000000000006', 'a0a0a0a0-0002-4000-8000-000000000002',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'NO SHAME in MMMBop 😂',
   '50505050-0202-4000-8000-000000000006',
   '2026-03-28T13:00:00+00:00'),
  ('c0c0c0c0-0007-4000-8000-000000000007', 'a0a0a0a0-0002-4000-8000-000000000002',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'call me maybe is elite, don''t @ me',
   '50505050-0203-4000-8000-000000000007',
   '2026-03-28T13:05:00+00:00'),
  ('c0c0c0c0-0008-4000-8000-000000000008', 'a0a0a0a0-0002-4000-8000-000000000002',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'spice girls supremacy 🙌',
   '50505050-0204-4000-8000-000000000008',
   '2026-03-28T13:10:00+00:00'),
  ('c0c0c0c0-0009-4000-8000-000000000009', 'a0a0a0a0-0002-4000-8000-000000000002',
   'a1b2c3d4-1111-4000-8000-000000000001', 'guilty as charged with all of these', null,
   '2026-03-28T13:15:00+00:00'),
  ('c0c0c0c0-0010-4000-8000-000000000010', 'a0a0a0a0-0002-4000-8000-000000000002',
   'b39dc477-605d-4a0e-9ac3-90df78f0130b', 'britney forever 💅',
   '50505050-0201-4000-8000-000000000005',
   '2026-03-28T13:20:00+00:00'),
  ('c0c0c0c0-0011-4000-8000-000000000011', 'a0a0a0a0-0002-4000-8000-000000000002',
   'a1b2c3d4-2222-4000-8000-000000000002', 'wannabe is such a vibe',
   '50505050-0204-4000-8000-000000000008',
   '2026-03-28T13:25:00+00:00'),
  -- Tape 3 comments (6)
  ('c0c0c0c0-0012-4000-8000-000000000012', 'a0a0a0a0-0003-4000-8000-000000000003',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'eye of the tiger??? come ON 💪🔥',
   '50505050-0304-4000-8000-000000000012',
   '2026-03-29T13:00:00+00:00'),
  ('c0c0c0c0-0013-4000-8000-000000000013', 'a0a0a0a0-0003-4000-8000-000000000003',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'two kanye picks, respect', null,
   '2026-03-29T13:05:00+00:00'),
  ('c0c0c0c0-0014-4000-8000-000000000014', 'a0a0a0a0-0003-4000-8000-000000000003',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'beyoncé runs the world confirmed',
   '50505050-0302-4000-8000-000000000010',
   '2026-03-29T13:10:00+00:00'),
  ('c0c0c0c0-0015-4000-8000-000000000015', 'a0a0a0a0-0003-4000-8000-000000000003',
   'a1b2c3d4-1111-4000-8000-000000000001', 'lose yourself is the GOAT pick',
   '50505050-0301-4000-8000-000000000009',
   '2026-03-29T13:15:00+00:00'),
  ('c0c0c0c0-0016-4000-8000-000000000016', 'a0a0a0a0-0003-4000-8000-000000000003',
   'a1b2c3d4-4444-4000-8000-000000000004', 'this whole tape goes hard', null,
   '2026-03-29T13:20:00+00:00'),
  ('c0c0c0c0-0017-4000-8000-000000000017', 'a0a0a0a0-0003-4000-8000-000000000003',
   'a1b2c3d4-4444-4000-8000-000000000004', 'run the world is PERFECT for this prompt',
   '50505050-0302-4000-8000-000000000010',
   '2026-03-29T13:25:00+00:00'),
  -- Tape 4 comments (7)
  ('c0c0c0c0-0018-4000-8000-000000000018', 'a0a0a0a0-0004-4000-8000-000000000004',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'purple rain as a closer... chills 🥲',
   '50505050-0403-4000-8000-000000000016',
   '2026-03-30T13:00:00+00:00'),
  ('c0c0c0c0-0019-4000-8000-000000000019', 'a0a0a0a0-0004-4000-8000-000000000004',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'heroes is the only right answer tbh',
   '50505050-0404-4000-8000-000000000017',
   '2026-03-30T13:05:00+00:00'),
  ('c0c0c0c0-0020-4000-8000-000000000020', 'a0a0a0a0-0004-4000-8000-000000000004',
   'd65ea8f9-edf4-4474-aa03-ea5b9644284e', 'what a session, everyone crushed it 🎉', null,
   '2026-03-30T13:10:00+00:00'),
  ('c0c0c0c0-0021-4000-8000-000000000021', 'a0a0a0a0-0004-4000-8000-000000000004',
   'a1b2c3d4-1111-4000-8000-000000000001', 'last nite is such a Sam pick 😄',
   '50505050-0401-4000-8000-000000000014',
   '2026-03-30T13:15:00+00:00'),
  ('c0c0c0c0-0022-4000-8000-000000000022', 'a0a0a0a0-0004-4000-8000-000000000004',
   'a1b2c3d4-4444-4000-8000-000000000004', 'everlong 😭😭😭',
   '50505050-0402-4000-8000-000000000015',
   '2026-03-30T13:20:00+00:00'),
  ('c0c0c0c0-0023-4000-8000-000000000023', 'a0a0a0a0-0004-4000-8000-000000000004',
   'b39dc477-605d-4a0e-9ac3-90df78f0130b', 'perfect ending 🎶', null,
   '2026-03-30T13:25:00+00:00'),
  ('c0c0c0c0-0024-4000-8000-000000000024', 'a0a0a0a0-0004-4000-8000-000000000004',
   'a1b2c3d4-2222-4000-8000-000000000002', 'heroes hit different as the last song',
   '50505050-0404-4000-8000-000000000017',
   '2026-03-30T13:30:00+00:00');
