-- 1. Add 'upcoming' to tape_status enum
ALTER TYPE public.tape_status ADD VALUE 'upcoming';

-- 2. Add comment_window_hours column
ALTER TABLE public.tapes ADD COLUMN comment_window_hours integer NOT NULL DEFAULT 120;

-- 3. Trigger: auto-advance next upcoming tape when a tape completes
CREATE OR REPLACE FUNCTION advance_next_tape()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status IN ('results', 'skipped') AND OLD.status IS DISTINCT FROM NEW.status THEN
    UPDATE public.tapes
    SET status = 'submitting'
    WHERE id = (
      SELECT id FROM public.tapes
      WHERE session_id = NEW.session_id
        AND status = 'upcoming'
        AND id != NEW.id
      ORDER BY created_at
      LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_advance_next_tape
  AFTER UPDATE ON public.tapes
  FOR EACH ROW
  EXECUTE FUNCTION advance_next_tape();

-- 4. Trigger: set deadline when tape enters playlist_ready
CREATE OR REPLACE FUNCTION set_playlist_ready_deadline()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'playlist_ready' AND OLD.status IS DISTINCT FROM 'playlist_ready' THEN
    UPDATE public.tapes
    SET deadline = now() + (NEW.comment_window_hours * interval '1 hour')
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_playlist_ready_deadline
  AFTER UPDATE ON public.tapes
  FOR EACH ROW
  EXECUTE FUNCTION set_playlist_ready_deadline();

-- 5. Update cron job to also advance expired playlist_ready tapes
SELECT cron.unschedule('advance-expired-tapes');

SELECT cron.schedule(
  'advance-expired-tapes',
  '*/30 * * * *',
  $$
    -- Advance submitting tapes with submissions to playlist_ready
    UPDATE public.tapes SET status = 'playlist_ready'
    WHERE status = 'submitting'
      AND deadline IS NOT NULL
      AND deadline < now()
      AND EXISTS (SELECT 1 FROM public.submissions WHERE tape_id = tapes.id);

    -- Skip submitting tapes with no submissions
    UPDATE public.tapes SET status = 'skipped'
    WHERE status = 'submitting'
      AND deadline IS NOT NULL
      AND deadline < now()
      AND NOT EXISTS (SELECT 1 FROM public.submissions WHERE tape_id = tapes.id);

    -- Advance expired playlist_ready tapes to results
    UPDATE public.tapes SET status = 'results'
    WHERE status = 'playlist_ready'
      AND deadline IS NOT NULL
      AND deadline < now();
  $$
);
