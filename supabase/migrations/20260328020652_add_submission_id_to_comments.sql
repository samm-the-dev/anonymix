-- Add submission_id to comments for per-song commenting
-- null submission_id = tape-level comment ("The Tape")
ALTER TABLE public.comments
  ADD COLUMN submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE;
