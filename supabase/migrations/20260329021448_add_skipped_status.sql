-- Add 'skipped' to tape_status enum
ALTER TYPE public.tape_status ADD VALUE 'skipped';

-- Update cron job: advance expired tapes with submissions to playlist_ready,
-- advance expired tapes with no submissions to skipped
SELECT cron.unschedule('advance-expired-tapes');

SELECT cron.schedule(
  'advance-expired-tapes',
  '*/30 * * * *',
  $$
    -- Advance tapes with submissions to playlist_ready
    UPDATE public.tapes SET status = 'playlist_ready'
    WHERE status = 'submitting'
      AND deadline IS NOT NULL
      AND deadline < now()
      AND EXISTS (SELECT 1 FROM public.submissions WHERE tape_id = tapes.id);

    -- Skip tapes with no submissions
    UPDATE public.tapes SET status = 'skipped'
    WHERE status = 'submitting'
      AND deadline IS NOT NULL
      AND deadline < now()
      AND NOT EXISTS (SELECT 1 FROM public.submissions WHERE tape_id = tapes.id);
  $$
);
