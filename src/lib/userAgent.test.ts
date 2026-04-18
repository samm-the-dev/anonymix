import { describe, it, expect, vi, afterEach } from 'vitest';
import { isAndroid } from './userAgent';

const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36';
const IOS_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const DESKTOP_CHROME =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

function mockUA(ua: string) {
  vi.stubGlobal('navigator', { userAgent: ua });
}

describe('isAndroid', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true for Android Chrome', () => {
    mockUA(ANDROID_CHROME);
    expect(isAndroid()).toBe(true);
  });

  it('returns false for iOS Safari', () => {
    mockUA(IOS_SAFARI);
    expect(isAndroid()).toBe(false);
  });

  it('returns false for desktop Chrome', () => {
    mockUA(DESKTOP_CHROME);
    expect(isAndroid()).toBe(false);
  });

  it('returns false when navigator is undefined', () => {
    vi.stubGlobal('navigator', undefined);
    expect(isAndroid()).toBe(false);
  });
});
