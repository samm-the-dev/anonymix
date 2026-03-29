import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { TapeStatus } from '@/lib/types';

const badgeVariants = cva(
  'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
  {
    variants: {
      status: {
        upcoming: 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400',
        submitting: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
        playlist_ready: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
        results: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
        skipped: 'bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400',
      },
    },
  },
);

const STATUS_LABELS: Record<TapeStatus, string> = {
  upcoming: 'Upcoming',
  submitting: 'Submitting',
  playlist_ready: 'Listening',
  results: 'Complete',
  skipped: 'Skipped',
};

interface StatusBadgeProps {
  status: TapeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <span className={cn(badgeVariants({ status }), className)}>{STATUS_LABELS[status]}</span>;
}
