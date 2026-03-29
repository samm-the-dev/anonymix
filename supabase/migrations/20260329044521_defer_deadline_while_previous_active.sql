-- Update first-submission deadline trigger:
-- Only set deadline if no other tape in the session is in playlist_ready.
-- If a previous tape is still active, deadline will be set when it completes
-- (via advance_next_tape trigger which re-checks).
CREATE OR REPLACE FUNCTION set_tape_deadline_on_first_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  has_active_prior boolean;
BEGIN
  -- Check if another tape in this session is still in playlist_ready
  SELECT EXISTS (
    SELECT 1 FROM public.tapes
    WHERE session_id = (SELECT session_id FROM public.tapes WHERE id = NEW.tape_id)
      AND id != NEW.tape_id
      AND status = 'playlist_ready'
  ) INTO has_active_prior;

  -- Only set deadline if no prior tape is still active
  IF NOT has_active_prior THEN
    UPDATE public.tapes
    SET deadline = now() + (submit_window_hours * interval '1 hour')
    WHERE id = NEW.tape_id
      AND deadline IS NULL
      AND status = 'submitting';
  END IF;

  RETURN NEW;
END;
$$;

-- Also update advance_next_tape: when a tape completes and the next tape
-- is already submitting with submissions but no deadline, set its deadline now.
CREATE OR REPLACE FUNCTION advance_next_tape()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  next_tape_id uuid;
BEGIN
  IF NEW.status IN ('playlist_ready', 'results', 'skipped') AND OLD.status IS DISTINCT FROM NEW.status THEN
    -- Advance next upcoming tape to submitting
    SELECT id INTO next_tape_id
    FROM public.tapes
    WHERE session_id = NEW.session_id
      AND status = 'upcoming'
      AND id != NEW.id
    ORDER BY created_at
    LIMIT 1;

    IF next_tape_id IS NOT NULL THEN
      UPDATE public.tapes SET status = 'submitting' WHERE id = next_tape_id;
    END IF;
  END IF;

  -- When a tape reaches results/skipped, start the deadline on any
  -- submitting tape that has submissions but no deadline yet
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
