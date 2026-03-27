# Anonymix

Anonymous music sharing with friends — themed submissions, comments, reveals.

## Development Process

- **New features require an OpenSpec proposal** before implementation. Use `/opsx:propose` to create one.
- **Always reference prototypes** in `_bmad-output/D-Prototypes/` and UX scenarios in `_bmad-output/C-UX-Scenarios/` when building UI.
- **Run `npm run db:advisors`** after pushing Supabase migrations.

## Tech Stack

- React 19, Vite 7, TypeScript, Tailwind CSS 4, React Router 7
- Supabase (Postgres, Auth, Realtime, RLS)
- MusicBrainz API for song search
- Terminology: Session (group), Tape (round), Prompt (theme), Submission (song pick)

## Key Directories

- `src/` — React frontend
- `supabase/` — migrations, seed data, config
- `openspec/` — specs and changes
- `_bmad-output/` — UX scenarios and prototypes (source of truth for design)
- `scripts/` — dev tooling (advisor check, icon gen, OG gen)
