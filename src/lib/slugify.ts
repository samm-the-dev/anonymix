/**
 * Generate a URL slug from a session name + ID.
 * Format: "session-name-a8f3" (name slugified + first 4 chars of UUID)
 */
export function sessionSlug(name: string, id: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = id.slice(0, 4);
  return `${base}-${suffix}`;
}

/**
 * Extract the 4-char ID suffix from a session slug.
 */
export function sessionIdFromSlug(slug: string): string {
  return slug.slice(-4);
}
