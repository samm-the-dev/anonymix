import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Download, Copy, Check, ChevronDown } from 'lucide-react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useAuthContext } from '@/contexts/AuthContext';
import { useOdesliLinks, PLATFORM_LABELS, type MusicPlatform, type OdesliResult } from '@/hooks/useOdesliLinks';
import { generateXspf, generatePlainText, downloadFile } from '@/lib/playlistExport';
import { slugify } from '@/lib/slugify';
import { supabase } from '@/lib/supabase';

type ListeningTab = 'links' | 'copy' | 'file';

interface Submission {
  id: string;
  song_name: string;
  artist_name: string;
  deezer_id: string | null;
  player_id: string;
}

interface ListeningSectionProps {
  songs: Submission[];
  playlistTitle?: string;
  playlistDescription?: string;
  currentPlayerId?: string;
  onLinksReady?: (links: Map<string, OdesliResult>, service: MusicPlatform | null) => void;
}

const TAB_OPTIONS: { value: ListeningTab; label: string }[] = [
  { value: 'links', label: 'Links' },
  { value: 'copy', label: 'Copy Text' },
  { value: 'file', label: 'Download File' },
];

const SERVICE_OPTIONS: MusicPlatform[] = [
  'spotify',
  'appleMusic',
  'youtubeMusic',
  'youtube',
  'deezer',
  'tidal',
  'amazonMusic',
  'soundcloud',
];

function ServiceDropdown({
  value,
  onChange,
}: {
  value: MusicPlatform | null;
  onChange: (v: MusicPlatform | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground"
      >
        {value ? PLATFORM_LABELS[value] : 'Choose service'}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-border bg-background py-1 shadow-lg">
          <button
            onClick={() => { onChange(null); setOpen(false); }}
            className={`w-full px-3 py-1.5 text-left text-xs ${value === null ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            None
          </button>
          {SERVICE_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className={`w-full px-3 py-1.5 text-left text-xs ${s === value ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {PLATFORM_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ListeningSection({
  songs,
  playlistTitle,
  playlistDescription,
  onLinksReady,
}: ListeningSectionProps) {
  const { player } = useAuthContext();
  const [tab, setTab] = useState<ListeningTab>('links');
  const [service, setService] = useState<MusicPlatform | null>(null);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const odesliInputs = songs.map((s) => ({ id: s.id, deezerId: s.deezer_id }));
  const links = useOdesliLinks(odesliInputs);

  // Load saved preferences
  useEffect(() => {
    if (!player || prefsLoaded) return;

    supabase
      .from('players')
      .select('listening_tab, music_service')
      .eq('id', player.id)
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.listening_tab) setTab(data.listening_tab as ListeningTab);
          if (data.music_service) setService(data.music_service as MusicPlatform);
        }
        setPrefsLoaded(true);
      });
  }, [player, prefsLoaded]);

  // Notify parent when links or service change
  useEffect(() => {
    onLinksReady?.(links, service);
  }, [links, service, onLinksReady]);

  // Persist tab preference
  const saveTab = useCallback(
    (value: ListeningTab) => {
      setTab(value);
      if (player) {
        supabase.from('players').update({ listening_tab: value }).eq('id', player.id).then();
      }
    },
    [player],
  );

  // Persist service preference
  const saveService = useCallback(
    (value: MusicPlatform | null) => {
      setService(value);
      if (player) {
        supabase.from('players').update({ music_service: value ?? undefined }).eq('id', player.id).then();
      }
    },
    [player],
  );

  const meta = {
    title: playlistTitle || 'Anonymix Playlist',
    description: playlistDescription,
  };
  const filename = slugify(meta.title) || 'anonymix-playlist';

  function handleCopy() {
    const text = generatePlainText(songs);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const content = generateXspf(songs, meta);
    downloadFile(content, `${filename}.xspf`, 'application/octet-stream');
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
    window.open('https://www.tunemymusic.com/', '_blank');
  }

  if (songs.length === 0) return null;

  return (
    <div className="border-b border-border px-4 py-3">
      <p className="text-sm text-muted-foreground">
        Listen to your playlist on your preferred music service
      </p>
      {/* Segmented control */}
      <ToggleGroup.Root
        type="single"
        value={tab}
        onValueChange={(v) => {
          if (v) saveTab(v as ListeningTab);
        }}
        className="mb-3 flex w-full rounded-lg bg-secondary p-0.5"
      >
        {TAB_OPTIONS.map((opt) => (
          <ToggleGroup.Item
            key={opt.value}
            value={opt.value}
            className="flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
          >
            {opt.label}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>

      {/* Links tab */}
      {tab === 'links' && (
        <div className="flex items-center justify-end gap-2">
          <p className="text-xs text-muted-foreground">Link to</p>
          <ServiceDropdown value={service} onChange={saveService} />
        </div>
      )}

      {/* Copy Text tab */}
      {tab === 'copy' && (
        <div>
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Tap below to copy the song list and open TuneMyMusic</li>
            <li>Scroll down, select &ldquo;Free text&rdquo;, paste the list</li>
            <li>Choose your destination service and start transfer</li>
          </ol>
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Songs & Open Transfer'}
            {!copied && <ExternalLink className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* Download File tab */}
      {tab === 'file' && (
        <div>
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Tap below to save the playlist and open TuneMyMusic</li>
            <li>Scroll down, select &ldquo;Upload file&rdquo;, upload the file</li>
            <li>Choose your destination service and start transfer</li>
          </ol>
          <button
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Download className="h-4 w-4" />
            {downloaded ? 'Saved!' : 'Save File & Open Transfer'}
            {!downloaded && <ExternalLink className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}

/** Get the platform link for a song from the Odesli results */
export function getSongLink(
  links: Map<string, OdesliResult>,
  songId: string,
  service: MusicPlatform | null,
): string | null {
  if (!service) return null;
  const result = links.get(songId);
  return result?.platformLinks[service] ?? result?.pageUrl ?? null;
}
