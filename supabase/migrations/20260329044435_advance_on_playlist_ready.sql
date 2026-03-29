-- Update advance_next_tape trigger to also fire on playlist_ready
-- This lets players submit to the next tape while listening to the current one
CREATE OR REPLACE FUNCTION advance_next_tape()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status IN ('playlist_ready', 'results', 'skipped') AND OLD.status IS DISTINCT FROM NEW.status THEN
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
