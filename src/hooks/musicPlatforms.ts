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
  tidal: (q) => `https://listen.tidal.com/search?q=${encodeURIComponent(q)}`,
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
