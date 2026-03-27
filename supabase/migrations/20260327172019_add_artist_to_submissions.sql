-- Add artist name to submissions
alter table submissions add column artist_name text not null default '';
