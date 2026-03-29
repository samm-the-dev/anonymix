-- Move any tapes stuck in 'commenting' to 'playlist_ready' before removing the value
UPDATE public.tapes SET status = 'playlist_ready' WHERE status = 'commenting';

-- Remove 'commenting' from tape_status enum
-- Postgres doesn't support DROP VALUE directly, so recreate the enum
ALTER TABLE public.tapes ALTER COLUMN status DROP DEFAULT;

ALTER TYPE public.tape_status RENAME TO tape_status_old;

CREATE TYPE public.tape_status AS ENUM ('submitting', 'playlist_ready', 'results');

ALTER TABLE public.tapes
  ALTER COLUMN status TYPE public.tape_status USING status::text::public.tape_status;

ALTER TABLE public.tapes ALTER COLUMN status SET DEFAULT 'submitting';

DROP TYPE public.tape_status_old;
