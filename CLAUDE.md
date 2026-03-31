# Anonymix

Anonymous music sharing with friends — themed submissions, comments, reveals.

## Development Process

- **New features require an OpenSpec proposal** before implementation. Use `/opsx:propose` to create one.
- **Always reference prototypes** in `_bmad-output/D-Prototypes/` and UX scenarios in `_bmad-output/C-UX-Scenarios/` when building UI.
- **Run `npm run db:advisors`** after pushing Supabase migrations.
- **Never touch prod data from local dev.** All prod changes go through GHA deploy or the Supabase dashboard.

## Tech Stack

- React 19, Vite 7, TypeScript, Tailwind CSS 4, React Router 7
- Supabase (Postgres, Auth, Realtime, RLS, Edge Functions)
- Deezer API for song search (via Edge Function proxy)
- Terminology: Session (group), Tape (round), Prompt (theme), Submission (song pick)

## Key Directories

- `src/` — React frontend
- `supabase/` — migrations, seed data, config
- `openspec/` — specs and changes
- `_bmad-output/` — UX scenarios and prototypes (source of truth for design)
- `scripts/` — dev tooling (advisor check, icon gen, OG gen, preview env resolver)

## Environments

| Environment | Code | DB | Deploy |
|---|---|---|---|
| Local dev | dev build (`npm run dev`) | Supabase preview branch (`.env.local`) | — |
| Vercel preview | prod build | Supabase preview branch (auto-resolved by `scripts/resolve-preview-env.mjs`) | Auto on PR push |
| GitHub Pages (prod) | prod build | Supabase prod | Auto on merge to main |

### Supabase Integrations

- **GitHub integration**: Auto-creates a Supabase preview branch per PR. Runs migrations, seeds data, tears down on merge/close. Config in `supabase/config.toml`.
- **Preview branch auth**: Redirect URLs configured in `supabase/config.toml` (`additional_redirect_urls`). The preview branch uses these, NOT the main project's dashboard settings.
- **Vercel prebuild script** (`scripts/resolve-preview-env.mjs`): Queries Supabase Management API to find the preview branch matching the PR's git branch, writes its URL + anon key to `.env.local` before Vite builds. Polls up to 5 min for branch readiness. Fails the build if not found.
- **Vercel env vars** (Preview only): `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`. Plus `VITE_VAPID_PUBLIC_KEY` (All Environments).
- **No Supabase Vercel integration** — disconnected because it doesn't swap URLs per preview branch. The prebuild script handles it.

### Local Dev Setup

1. `.env.local` should point to the current PR's Supabase preview branch URL + anon key
2. When starting a new PR with migrations, open a draft PR first so Supabase creates the preview branch
3. Get preview branch credentials from Supabase dashboard (Branches) or CLI: `npx supabase branches list --project-ref mryuusvhdadbjpupzpol`
4. Supabase CLI is linked to the preview branch project (not prod)

### After Merging a PR

1. Switch to main and pull: `git checkout main && git pull`
2. Run `npm run env:local` to update `.env.local` (auto-detects preview branch or falls back to prod)
3. Delete the merged local branch: `git branch -d <branch-name>`

### Switching Branches

Run `npm run env:local` after switching branches. It reads the current git branch, looks for a matching Supabase preview branch, and writes `.env.local`. Falls back to prod on main or if no preview branch exists. Requires `SUPABASE_ACCESS_TOKEN` env var (or in `.env` file).

### Prod Deploy

- GHA workflow (`.github/workflows/deploy-gh-pages.yml`) builds and deploys to GitHub Pages on push to main
- Supabase GitHub integration auto-runs migrations on merge to main
- Prod env vars are GitHub secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_VAPID_PUBLIC_KEY`
