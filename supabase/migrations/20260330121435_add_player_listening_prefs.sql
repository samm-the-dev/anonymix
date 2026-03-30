-- Add listening preference columns to players
alter table players add column listening_tab text not null default 'links';
alter table players add column music_service text;
