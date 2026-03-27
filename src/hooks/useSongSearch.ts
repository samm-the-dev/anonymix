import { useState, useRef, useCallback } from 'react';

export interface SongResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
}

const MB_BASE = 'https://musicbrainz.org/ws/2/recording';
const USER_AGENT = 'Anonymix/0.1.0 (https://anonymix.app)';

export function useSongSearch() {
  const [results, setResults] = useState<SongResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortRef = useRef<AbortController>(undefined);

  const search = useCallback((query: string) => {
    // Clear previous
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams({
          query: query.trim(),
          fmt: 'json',
          limit: '8',
        });

        const res = await fetch(`${MB_BASE}?${params}`, {
          headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        const recordings: SongResult[] = (data.recordings ?? []).map(
          (r: { id: string; title: string; 'artist-credit'?: { name: string }[]; releases?: { title: string }[] }) => ({
            id: r.id,
            title: r.title,
            artist: r['artist-credit']?.[0]?.name ?? 'Unknown Artist',
            album: r.releases?.[0]?.title,
          }),
        );

        setResults(recordings);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setSearching(false);
      }
    }, 350);
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setSearching(false);
  }, []);

  return { results, searching, search, clear };
}
