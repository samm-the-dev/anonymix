const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Compute a new deadline by adding 24h to the existing one.
 * If no existing deadline, adds 24h from now.
 */
export function computeExtendedDeadline(currentDeadline: string | null, now = Date.now()): string {
  const base = currentDeadline ? new Date(currentDeadline).getTime() : now;
  return new Date(base + ONE_DAY_MS).toISOString();
}
