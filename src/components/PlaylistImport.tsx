import { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';

interface PlaylistImportProps {
  songs: { song_name: string; artist_name: string }[];
}

export function PlaylistImport({ songs }: PlaylistImportProps) {
  const [copied, setCopied] = useState(false);

  function copyAndOpen() {
    const text = songs
      .map((s) => (s.artist_name ? `${s.artist_name} - ${s.song_name}` : s.song_name))
      .join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open('https://www.tunemymusic.com/', '_blank');
  }

  if (songs.length === 0) return null;

  return (
    <div className="border-b border-border px-4 py-3">
      <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Click the button below to copy the songs and open TuneMyMusic</li>
        <li>Scroll down and select the "Free text" option, then paste</li>
        <li>Choose your destination service, log in, and transfer</li>
      </ol>
      <button
        onClick={copyAndOpen}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
      >
        <Copy className="h-4 w-4" />
        {copied ? 'Copied!' : 'Copy Songs & Open Transfer'}
        {copied ? '' : <ExternalLink className="h-4 w-4" />}
      </button>
    </div>
  );
}
