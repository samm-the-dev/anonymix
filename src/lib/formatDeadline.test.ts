import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDeadline } from './formatDeadline';

describe('formatDeadline', () => {
  const NOW = new Date('2026-03-26T12:00:00Z').getTime();
  const DAY = 86400000;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('submitting/commenting status', () => {
    it('returns "due today" when deadline is today', () => {
      expect(formatDeadline('submitting', NOW + DAY * 0.3)).toBe('due today');
    });

    it('returns "due tomorrow" when deadline is 1 day away', () => {
      expect(formatDeadline('submitting', NOW + DAY)).toBe('due tomorrow');
    });

    it('returns "due in N days" for future deadlines', () => {
      expect(formatDeadline('submitting', NOW + 3 * DAY)).toBe('due in 3 days');
    });

    it('returns "due (overdue)" when deadline has passed', () => {
      expect(formatDeadline('commenting', NOW - DAY)).toBe('due (overdue)');
    });

    it('returns empty string when no deadline provided', () => {
      expect(formatDeadline('submitting')).toBe('');
    });
  });

  describe('playlist_ready status', () => {
    it('always returns empty string', () => {
      expect(formatDeadline('playlist_ready', NOW + DAY)).toBe('');
    });
  });

  describe('results status', () => {
    it('returns "today" for same-day completion', () => {
      expect(formatDeadline('results', undefined, NOW - 1000)).toBe('today');
    });

    it('returns "yesterday" for 1-day-ago completion', () => {
      expect(formatDeadline('results', undefined, NOW - DAY)).toBe('yesterday');
    });

    it('returns "N days ago" for recent completions', () => {
      expect(formatDeadline('results', undefined, NOW - 5 * DAY)).toBe('5 days ago');
    });

    it('returns "~N months ago" for older completions', () => {
      expect(formatDeadline('results', undefined, NOW - 90 * DAY)).toBe('~3 months ago');
    });

    it('returns empty string when no completedAt', () => {
      expect(formatDeadline('results')).toBe('');
    });
  });
});
