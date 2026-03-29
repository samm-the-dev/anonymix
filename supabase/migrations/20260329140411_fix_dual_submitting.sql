-- Fix: advance_next_tape should only advance when no tape is currently submitting.
-- Previously, transitioning to both playlist_ready AND results could each advance
-- a different upcoming tape, resulting in two tapes submitting simultaneously.
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
  RETURN NEW;
END;
$$;
