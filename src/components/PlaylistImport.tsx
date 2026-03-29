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
        <li>Download the playlist file or copy the songs below</li>
        <li>
          Open{' '}
          <a
            href="https://www.tunemymusic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            TuneMyMusic
          </a>
          , choose "File" as source, and upload
        </li>
        <li>Choose your destination service, log in, and transfer</li>
      </ol>

      <div className="flex flex-col gap-2">
        {/* Download buttons row */}
        <div className="flex gap-2">
          <button
            onClick={downloadXspf}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Download className="h-4 w-4" />
            Download .xspf
          </button>
          <button
            onClick={downloadCsvFile}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            .csv
          </button>
        </div>

        {/* Copy fallback */}
        <button
          onClick={copyAndOpen}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Copy className="h-4 w-4" />
          {copied ? 'Copied!' : 'Copy & Open TuneMyMusic'}
          {copied ? '' : <ExternalLink className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
