import { isAndroid } from '@/lib/userAgent';

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

const SEARCH_URL_BUILDERS: Record<MusicPlatform, (q: string) => string> = {
  spotify: (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}`,
  appleMusic: (q) => `https://music.apple.com/search?term=${encodeURIComponent(q)}`,
  youtubeMusic: (q) => `https://music.youtube.com/search?q=${encodeURIComponent(q)}`,
  youtube: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  deezer: (q) => `https://www.deezer.com/search/${encodeURIComponent(q)}`,
  // Tidal's App Links claim only content paths (track/album/artist), not /search.
  // On Android we wrap the confirmed-working `tidal://search?q=...` scheme in an
  // intent:// URL so Chrome/Samsung Internet launch the installed Tidal app and
  // fall back to the web player when it isn't. Other OSs use the web URL directly.
  tidal: (q) => {
    const encoded = encodeURIComponent(q);
    const webUrl = `https://listen.tidal.com/search?q=${encoded}`;
    if (!isAndroid()) return webUrl;
    return `intent://search?q=${encoded}#Intent;scheme=tidal;package=com.aspiro.tidal;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
  },
  amazonMusic: (q) => `https://music.amazon.com/search/${encodeURIComponent(q)}`,
  soundcloud: (q) => `https://soundcloud.com/search?q=${encodeURIComponent(q)}`,
};

/** Build a search URL for a song on the given platform. Always works, no API call. */
export function buildSongSearchUrl(
  songName: string,
  artistName: string,
  platform: MusicPlatform,
): string {
  const query = artistName ? `${songName} ${artistName}` : songName;
  return SEARCH_URL_BUILDERS[platform](query);
}
