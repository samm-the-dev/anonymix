-- Fix: advance_next_tape should only advance when no tape is currently submitting.
-- Previously, transitioning to both playlist_ready AND results could each advance
-- a different upcoming tape, resulting in two tapes submitting simultaneously.
-- Also preserves deadline-deferral logic from 20260329044521: when a tape reaches
-- results/skipped, start the deadline on any submitting tape that already has
-- submissions but was waiting because a prior tape was still active.
CREATE OR REPLACE FUNCTION advance_next_tape()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status IN ('playlist_ready', 'results', 'skipped') AND OLD.status IS DISTINCT FROM NEW.status THEN
    -- Only advance if no tape in this session is currently submitting
    IF NOT EXISTS (
      SELECT 1 FROM public.tapes
      WHERE session_id = NEW.session_id
        AND status = 'submitting'
        AND id != NEW.id
    ) THEN
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
  END IF;

  -- When a tape reaches results/skipped, start the deadline on any
  -- submitting tape that has submissions but no deadline yet
  -- (deadline was deferred because a prior tape was still active)
  IF NEW.status IN ('results', 'skipped') AND OLD.status IS DISTINCT FROM NEW.status THEN
    UPDATE public.tapes
    SET deadline = now() + (submit_window_hours * interval '1 hour')
    WHERE session_id = NEW.session_id
      AND status = 'submitting'
      AND deadline IS NULL
      AND EXISTS (SELECT 1 FROM public.submissions WHERE tape_id = tapes.id);
  END IF;

  RETURN NEW;
END;
$$;
