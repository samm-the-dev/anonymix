import { useState } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { generateXspf, downloadFile } from '@/lib/playlistExport';
import { slugify } from '@/lib/slugify';

interface PlaylistImportProps {
  songs: { song_name: string; artist_name: string }[];
  playlistTitle?: string;
  playlistDescription?: string;
}

export function PlaylistImport({ songs, playlistTitle, playlistDescription }: PlaylistImportProps) {
  const [downloaded, setDownloaded] = useState(false);

  const meta = {
    title: playlistTitle || 'Anonymix Playlist',
    description: playlistDescription,
  };

  const filename = slugify(meta.title) || 'anonymix-playlist';

  function downloadAndOpen() {
    const content = generateXspf(songs, meta);
    downloadFile(content, `${filename}.xspf`, 'application/xspf+xml');
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
    window.open('https://www.tunemymusic.com/', '_blank');
  }

  if (songs.length === 0) return null;

  return (
    <div className="border-b border-border px-4 py-3">
      <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Tap below to save the playlist file and open TuneMyMusic</li>
        <li>Choose "Select file from your device", upload the file</li>
        <li>Pick your destination service and transfer</li>
      </ol>
      <button
        onClick={downloadAndOpen}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
      >
        <Download className="h-4 w-4" />
        {downloaded ? 'Saved!' : 'Save Playlist & Open Transfer'}
        {downloaded ? '' : <ExternalLink className="h-4 w-4" />}
      </button>
    </div>
  );
}
