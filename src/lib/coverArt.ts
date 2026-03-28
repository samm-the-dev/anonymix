/**
 * Fetch album cover art URL from the MusicBrainz Cover Art Archive.
 * Returns the image URL (after redirect) or null if not found.
 */
export async function fetchCoverArtUrl(releaseId: string): Promise<string | null> {
  try {
    // The Cover Art Archive redirects to the actual image URL.
    // We follow the redirect and return the final URL.
    const res = await fetch(
      `https://coverartarchive.org/release/${releaseId}/front-250`,
      { redirect: 'follow' },
    );

    if (!res.ok) return null;

    // The final URL after redirect is the image URL
    return res.url;
  } catch {
    return null;
  }
}
