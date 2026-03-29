-- Add completed_at timestamp to sessions
ALTER TABLE public.sessions ADD COLUMN completed_at timestamptz;

-- Trigger: auto-complete session when all tapes are terminal
CREATE OR REPLACE FUNCTION check_session_complete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status IN ('results', 'skipped') AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.tapes
      WHERE session_id = NEW.session_id
        AND status NOT IN ('results', 'skipped')
    ) THEN
      UPDATE public.sessions
      SET ended = true, completed_at = now()
      WHERE id = NEW.session_id AND NOT ended;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_session_complete
  AFTER UPDATE ON public.tapes
  FOR EACH ROW
  EXECUTE FUNCTION check_session_complete();
