import { useState, useRef, useCallback } from 'react';

export interface SongResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverArtUrl?: string;
  /** Deezer track ID — used for Odesli resolution */
  deezerId?: string;
}

const DEEZER_BASE = 'https://api.deezer.com/search';

export function useSongSearch() {
  const [results, setResults] = useState<SongResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const abortRef = useRef<AbortController>(undefined);

  const search = useCallback((query: string) => {
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
          q: query.trim(),
          limit: '8',
        });

        const res = await fetch(`${DEEZER_BASE}?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();

        interface DeezerTrack {
          id: number;
          title: string;
          artist: { name: string };
          album: { id: number; title: string; cover_small: string; cover_medium: string };
        }

        const tracks: SongResult[] = (data.data ?? []).map((t: DeezerTrack) => ({
          id: String(t.id),
          title: t.title,
          artist: t.artist.name,
          album: t.album.title,
          coverArtUrl: t.album.cover_medium,
          deezerId: String(t.id),
        }));

        setResults(tracks);
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
