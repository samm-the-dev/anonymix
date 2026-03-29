import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { computeExtendedDeadline } from './extendDeadline';

describe('computeExtendedDeadline', () => {
  const NOW = new Date('2026-03-28T12:00:00Z').getTime();
  const DAY = 24 * 60 * 60 * 1000;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds 24h to an existing deadline', () => {
    const existing = new Date('2026-03-30T12:00:00Z').toISOString();
    const result = computeExtendedDeadline(existing, NOW);
    expect(new Date(result).getTime()).toBe(new Date('2026-03-31T12:00:00Z').getTime());
  });

  it('adds 24h from now when no deadline exists', () => {
    const result = computeExtendedDeadline(null, NOW);
    expect(new Date(result).getTime()).toBe(NOW + DAY);
  });

  it('extends a past deadline from the past time, not from now', () => {
    const past = new Date('2026-03-27T12:00:00Z').toISOString();
    const result = computeExtendedDeadline(past, NOW);
    expect(new Date(result).getTime()).toBe(new Date('2026-03-28T12:00:00Z').getTime());
  });
});
