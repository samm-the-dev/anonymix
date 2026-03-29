import { describe, it, expect } from 'vitest';
import { seededShuffle } from './seededShuffle';

describe('seededShuffle', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];

  it('returns same length array', () => {
    expect(seededShuffle(items, 'seed1')).toHaveLength(5);
  });

  it('contains all original items', () => {
    const result = seededShuffle(items, 'seed1');
    expect(result.sort()).toEqual([...items].sort());
  });

  it('produces deterministic output for same seed', () => {
    const a = seededShuffle(items, 'tape-abc123');
    const b = seededShuffle(items, 'tape-abc123');
    expect(a).toEqual(b);
  });

  it('produces different output for different seeds', () => {
    const a = seededShuffle(items, 'seed-one');
    const b = seededShuffle(items, 'seed-two');
    expect(a).not.toEqual(b);
  });

  it('does not mutate the original array', () => {
    const original = [...items];
    seededShuffle(items, 'seed1');
    expect(items).toEqual(original);
  });

  it('handles single item', () => {
    expect(seededShuffle(['only'], 'seed')).toEqual(['only']);
  });

  it('handles empty array', () => {
    expect(seededShuffle([], 'seed')).toEqual([]);
  });
});
