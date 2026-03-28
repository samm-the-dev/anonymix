-- 1. Add submit window duration to tapes
alter table tapes add column submit_window_hours integer not null default 48;

-- 2. Trigger: set tape deadline on first submission
create or replace function set_tape_deadline_on_first_submission()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.tapes
  set deadline = now() + (submit_window_hours * interval '1 hour')
  where id = NEW.tape_id
    and deadline is null
    and status = 'submitting';
  return NEW;
end;
$$;

create trigger trg_set_tape_deadline
  after insert on submissions
  for each row
  execute function set_tape_deadline_on_first_submission();

-- 3. Enable pg_cron and schedule auto-advance job
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'advance-expired-tapes',
  '*/30 * * * *',
  $$UPDATE public.tapes SET status = 'playlist_ready' WHERE status = 'submitting' AND deadline IS NOT NULL AND deadline < now()$$
);
