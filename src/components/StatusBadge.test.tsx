import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import type { TapeStatus } from '@/lib/types';

describe('StatusBadge', () => {
  const cases: { status: TapeStatus; label: string; colorClass: string }[] = [
    { status: 'submitting', label: 'Submitting', colorClass: 'bg-green-100' },
    { status: 'playlist_ready', label: 'Listening', colorClass: 'bg-amber-100' },
    { status: 'results', label: 'Complete', colorClass: 'bg-purple-100' },
  ];

  cases.forEach(({ status, label, colorClass }) => {
    it(`renders "${label}" with ${colorClass} for status "${status}"`, () => {
      render(<StatusBadge status={status} />);
      const badge = screen.getByText(label);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain(colorClass);
    });
  });
});
