-- Add slug column to sessions for pretty URLs
ALTER TABLE public.sessions ADD COLUMN slug text;

-- Backfill existing sessions: lowercase name, replace non-alphanum with dashes, append first 4 of id
UPDATE public.sessions
SET slug = regexp_replace(
  regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'),
  '^-+|-+$', '', 'g'
) || '-' || left(id::text, 4);

-- Make it non-null after backfill
ALTER TABLE public.sessions ALTER COLUMN slug SET NOT NULL;

-- Unique index for direct lookup
CREATE UNIQUE INDEX sessions_slug_idx ON public.sessions (slug);
