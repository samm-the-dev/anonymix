import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildSongSearchUrl } from './musicPlatforms';

const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';
const IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

function mockUA(ua: string) {
  vi.stubGlobal('navigator', { userAgent: ua });
}

describe('buildSongSearchUrl — Tidal', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns an intent:// URL on Android with the web URL as browser_fallback_url', () => {
    mockUA(ANDROID_UA);
    const url = buildSongSearchUrl('Who Are You', 'The Who', 'tidal');

    expect(url.startsWith('intent://search?q=')).toBe(true);
    expect(url).toContain('scheme=tidal');
    expect(url).toContain('package=com.aspiro.tidal');
    expect(url).toContain(
      `S.browser_fallback_url=${encodeURIComponent('https://listen.tidal.com/search?q=Who%20Are%20You%20The%20Who')}`,
    );
    expect(url.endsWith(';end')).toBe(true);
  });

  it('returns the https listen.tidal.com URL on iOS', () => {
    mockUA(IOS_UA);
    expect(buildSongSearchUrl('Who Are You', 'The Who', 'tidal')).toBe(
      'https://listen.tidal.com/search?q=Who%20Are%20You%20The%20Who',
    );
  });

  it('returns the https listen.tidal.com URL on desktop', () => {
    mockUA(DESKTOP_UA);
    expect(buildSongSearchUrl('Who Are You', 'The Who', 'tidal')).toBe(
      'https://listen.tidal.com/search?q=Who%20Are%20You%20The%20Who',
    );
  });
});

describe('buildSongSearchUrl — other platforms unaffected by Android UA', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('Spotify URL is the same on Android and desktop', () => {
    mockUA(ANDROID_UA);
    const android = buildSongSearchUrl('Song', 'Artist', 'spotify');
    mockUA(DESKTOP_UA);
    const desktop = buildSongSearchUrl('Song', 'Artist', 'spotify');
    expect(android).toBe(desktop);
    expect(android).toBe('https://open.spotify.com/search/Song%20Artist');
  });

  it('Apple Music URL is the same on Android and desktop', () => {
    mockUA(ANDROID_UA);
    const android = buildSongSearchUrl('Song', 'Artist', 'appleMusic');
    mockUA(DESKTOP_UA);
    const desktop = buildSongSearchUrl('Song', 'Artist', 'appleMusic');
    expect(android).toBe(desktop);
  });
});
