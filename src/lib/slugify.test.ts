import { describe, it, expect } from 'vitest';
import { sessionSlug, sessionIdFromSlug } from './slugify';

describe('sessionSlug', () => {
  it('generates slug from name and id', () => {
    expect(sessionSlug('Friday Night Jams', 'a8f3e2b1-1234-5678-9abc-def012345678'))
      .toBe('friday-night-jams-a8f3');
  });

  it('strips special characters', () => {
    expect(sessionSlug('Rock & Roll!!!', 'b2c4d6e8-0000-0000-0000-000000000000'))
      .toBe('rock-roll-b2c4');
  });

  it('handles leading/trailing dashes from special chars', () => {
    expect(sessionSlug('---hello---', 'abcd1234-0000-0000-0000-000000000000'))
      .toBe('hello-abcd');
  });

  it('handles single word', () => {
    expect(sessionSlug('Vibes', '1234abcd-0000-0000-0000-000000000000'))
      .toBe('vibes-1234');
  });
});

describe('sessionIdFromSlug', () => {
  it('extracts last 4 chars', () => {
    expect(sessionIdFromSlug('friday-night-jams-a8f3')).toBe('a8f3');
  });
});
