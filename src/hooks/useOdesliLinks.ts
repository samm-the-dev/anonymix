import { useState, useEffect, useRef } from 'react';

const ODESLI_BASE = 'https://api.song.link/v1-alpha.1/links';
const DELAY_MS = 200;

interface OdesliInput {
  id: string;
  deezerId: string | null;
}

/**
 * Resolves MusicBrainz recording IDs to song.link URLs via the Odesli API.
 * Sequential with delay to respect 10 req/min rate limit.
 * Results cached in state — won't re-fetch on re-renders.
 */
export function useOdesliLinks(submissions: OdesliInput[]) {
  const [links, setLinks] = useState<Map<string, string>>(new Map());
  const resolvedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const toResolve = submissions.filter(
      (s) => s.deezerId && !resolvedRef.current.has(s.id),
    );

    if (toResolve.length === 0) return;

    let cancelled = false;

    async function resolve() {
      for (const sub of toResolve) {
        if (cancelled) break;
        if (!sub.deezerId) continue;

        try {
          const deezerUrl = `https://www.deezer.com/track/${sub.deezerId}`;
          const res = await fetch(
            `${ODESLI_BASE}?${new URLSearchParams({ url: deezerUrl })}`,
          );

          if (res.ok) {
            const data = await res.json();
            if (data.pageUrl) {
              setLinks((prev) => new Map(prev).set(sub.id, data.pageUrl));
            }
          }
        } catch {
          // Skip failed lookups
        }

        resolvedRef.current.add(sub.id);

        // Rate limit delay
        if (!cancelled) {
          await new Promise((r) => setTimeout(r, DELAY_MS));
        }
      }
    }

    resolve();

    return () => {
      cancelled = true;
    };
  }, [submissions]);

  return links;
}
