-- Seed: hello world session with tapes in all 5 statuses
-- Source: supabase/seed-data/hello-world-session.json

-- Auth user for dev/preview (magic link, pre-confirmed)
insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, aud, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
values (
  '00000000-0000-0000-0000-000000000099',
  '00000000-0000-0000-0000-000000000000',
  'smarsh09@gmail.com',
  crypt('testpassword', gen_salt('bf')),
  now(),
  'authenticated',
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  ''
);

insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
values (
  '00000000-0000-0000-0000-000000000099',
  '00000000-0000-0000-0000-000000000099',
  jsonb_build_object('sub', '00000000-0000-0000-0000-000000000099', 'email', 'smarsh09@gmail.com'),
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
