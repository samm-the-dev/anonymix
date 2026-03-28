-- Add MusicBrainz IDs and cover art URL to submissions
alter table submissions add column musicbrainz_id text;
alter table submissions add column release_id text;
alter table submissions add column cover_art_url text;
