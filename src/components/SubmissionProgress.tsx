interface SubmissionProgressProps {
  submitted: number;
  total: number;
  colorClass?: string;
  textColorClass?: string;
}

export function SubmissionProgress({
  submitted,
  total,
  colorClass = 'bg-green-500',
  textColorClass = 'text-green-600 dark:text-green-400',
}: SubmissionProgressProps) {
  const pct = total > 0 ? (submitted / total) * 100 : 0;

  return (
    <>
      <div className="mb-1 flex items-center gap-2">
        <span className={`text-xs font-medium ${textColorClass}`}>
          {submitted}/{total} submitted
        </span>
      </div>
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </>
  );
}
