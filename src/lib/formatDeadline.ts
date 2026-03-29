import type { TapeStatus } from './types';

/**
 * Format a tape's deadline or completion date as a relative string.
 *
 * - submitting/playlist_ready: "due today", "due tomorrow", "due in N days", "due (overdue)"
 * - results: "today", "yesterday", "N days ago", "~N months ago"
 */
export function formatDeadline(
  status: TapeStatus,
  deadline?: number,
  completedAt?: number,
): string {
  if (status === 'results') {
    if (!completedAt) return '';
    const days = Math.round((Date.now() - completedAt) / 86400000);
    if (days < 1) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.round(days / 30);
    return `~${months} month${months > 1 ? 's' : ''} ago`;
  }

  if (!deadline) return '';
  const days = Math.round((deadline - Date.now()) / 86400000);
  if (days < 0) return 'due (overdue)';
  if (days === 0) return 'due today';
  if (days === 1) return 'due tomorrow';
  return `due in ${days} days`;
}
