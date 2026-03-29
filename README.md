# Anonymix

Make mixtapes with friends. Anonymous submissions, themed rounds, real reactions.

## What is this?

Anonymix is a social music sharing game. Create a session with friends, set themed prompts ("songs establishing identity", "guilty pleasures"), and everyone submits a song anonymously. Listen to the compiled playlist, leave comments, then see the reveal — who picked what.

## How it works

1. **Create a session** with themed tape rounds
2. **Submit songs** anonymously to each tape via Deezer search
3. **Listen** to the compiled playlist (export to Spotify, YTM, etc. via TuneMyMusic)
4. **Comment** on songs that surprised you or nailed the theme
5. **Reveal** — see who submitted what and read the reactions

## Tech stack

- React 19, Vite 7, TypeScript, Tailwind CSS 4
- Supabase (Postgres, Auth, Edge Functions, RLS)
- Radix UI primitives
- Deezer API for song search
- PWA with service worker

## Development

```bash
npm install
npm run dev
```

Requires `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## License

All rights reserved. Source code is viewable but not licensed for reuse, modification, or distribution.
