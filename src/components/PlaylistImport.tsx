import { useState } from 'react';
import { Copy, Download, ExternalLink } from 'lucide-react';
import { generateXspf, generateCsv, downloadFile } from '@/lib/playlistExport';
import { slugify } from '@/lib/slugify';

interface PlaylistImportProps {
  songs: { song_name: string; artist_name: string }[];
  playlistTitle?: string;
  playlistDescription?: string;
}

export function PlaylistImport({ songs, playlistTitle, playlistDescription }: PlaylistImportProps) {
  const [copied, setCopied] = useState(false);

  const meta = {
    title: playlistTitle || 'Anonymix Playlist',
    description: playlistDescription,
  };

  const filename = slugify(meta.title) || 'anonymix-playlist';

  function copyAndOpen() {
    const text = songs
      .map((s) => (s.artist_name ? `${s.artist_name} - ${s.song_name}` : s.song_name))
      .join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open('https://www.tunemymusic.com/', '_blank');
  }

  function downloadXspf() {
    const content = generateXspf(songs, meta);
    downloadFile(content, `${filename}.xspf`, 'application/xspf+xml');
  }

  function downloadCsvFile() {
    const content = generateCsv(songs, meta);
    downloadFile(content, `${filename}.csv`, 'text/csv');
  }

  if (songs.length === 0) return null;

  return (
    <div className="border-b border-border px-4 py-3">
      <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Copy the songs and open TuneMyMusic</li>
        <li>Select "Free text", paste, and choose your destination</li>
      </ol>

      <div className="flex flex-col gap-2">
        <button
          onClick={copyAndOpen}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Copy className="h-4 w-4" />
          {copied ? 'Copied!' : 'Copy Songs & Open Transfer'}
          {copied ? '' : <ExternalLink className="h-4 w-4" />}
        </button>

        {/* File download alternatives */}
        <div className="flex gap-2">
          <button
            onClick={downloadXspf}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            Download .xspf
          </button>
          <button
            onClick={downloadCsvFile}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            Download .csv
          </button>
        </div>
      </div>
    </div>
  );
}
