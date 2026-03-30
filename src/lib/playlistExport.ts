interface Track {
  song_name: string;
  artist_name: string;
}

interface PlaylistMeta {
  title: string;
  description?: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateXspf(tracks: Track[], meta: PlaylistMeta): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<playlist version="1" xmlns="http://xspf.org/ns/0/">',
    `  <title>${escapeXml(meta.title)}</title>`,
  ];

  if (meta.description) {
    lines.push(`  <annotation>${escapeXml(meta.description)}</annotation>`);
  }

  lines.push('  <trackList>');

  for (const track of tracks) {
    lines.push('    <track>');
    lines.push(`      <title>${escapeXml(track.song_name)}</title>`);
    if (track.artist_name) {
      lines.push(`      <creator>${escapeXml(track.artist_name)}</creator>`);
    }
    lines.push('    </track>');
  }

  lines.push('  </trackList>');
  lines.push('</playlist>');

  return lines.join('\n');
}

function csvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCsv(tracks: Track[]): string {
  const lines = ['Title,Artist'];
  for (const track of tracks) {
    lines.push(`${csvField(track.song_name)},${csvField(track.artist_name)}`);
  }
  return lines.join('\n');
}

export function generatePlainText(tracks: Track[]): string {
  return tracks.map((t) => t.artist_name ? `${t.artist_name} - ${t.song_name}` : t.song_name).join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
