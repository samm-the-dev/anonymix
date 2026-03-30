import { useState, useEffect, useRef } from 'react';

const ODESLI_BASE = 'https://api.song.link/v1-alpha.1/links';
const DELAY_MS = 200;

export type MusicPlatform =
  | 'spotify'
  | 'appleMusic'
  | 'youtubeMusic'
  | 'youtube'
  | 'deezer'
  | 'tidal'
  | 'amazonMusic'
  | 'soundcloud';

export const PLATFORM_LABELS: Record<MusicPlatform, string> = {
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  youtubeMusic: 'YouTube Music',
  youtube: 'YouTube',
  deezer: 'Deezer',
  tidal: 'Tidal',
  amazonMusic: 'Amazon Music',
  soundcloud: 'SoundCloud',
};

export interface OdesliResult {
  pageUrl: string;
  platformLinks: Partial<Record<MusicPlatform, string>>;
}

interface OdesliInput {
  id: string;
  musicbrainzId: string | null;
}

/**
 * Resolves Deezer track IDs to platform-specific URLs via the Odesli API.
 * Sequential with delay to respect 10 req/min rate limit.
 * Results cached in state — won't re-fetch on re-renders.
 */
export function useOdesliLinks(submissions: OdesliInput[]) {
  const [links, setLinks] = useState<Map<string, OdesliResult>>(new Map());
  const resolvedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const toResolve = submissions.filter(
      (s) => s.musicbrainzId && !resolvedRef.current.has(s.id),
    );

    if (toResolve.length === 0) return;

    let cancelled = false;

    async function resolve() {
      for (const sub of toResolve) {
        if (cancelled) break;
        if (!sub.musicbrainzId) continue;

        try {
          const deezerUrl = `https://www.deezer.com/track/${sub.musicbrainzId}`;
          const res = await fetch(
            `${ODESLI_BASE}?${new URLSearchParams({ url: deezerUrl })}`,
          );

          if (res.ok) {
            const data = await res.json();
            const platformLinks: Partial<Record<MusicPlatform, string>> = {};

            if (data.linksByPlatform) {
              for (const [platform, info] of Object.entries(data.linksByPlatform)) {
                const key = platform as MusicPlatform;
                if (key in PLATFORM_LABELS && (info as { url?: string }).url) {
                  platformLinks[key] = (info as { url: string }).url;
                }
              }
            }

            if (data.pageUrl || Object.keys(platformLinks).length > 0) {
              setLinks((prev) =>
                new Map(prev).set(sub.id, {
                  pageUrl: data.pageUrl ?? '',
                  platformLinks,
                }),
              );
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
