import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Spinner } from '@/components/Spinner';
import { ListeningSection } from '@/components/ListeningSection';
import { buildSongSearchUrl, PLATFORM_LABELS, type MusicPlatform } from '@/hooks/musicPlatforms';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';

interface SubmissionRow {
  id: string;
  song_name: string;
  artist_name: string;
  player_id: string;
  deezer_id: string | null;
  cover_art_url: string | null;
}

interface CommentRow {
  id: string;
  submission_id: string | null;
  text: string;
  player_id: string;
}

interface PlayerInfo {
  id: string;
  name: string;
  avatar: string;
  avatar_color: string;
}

import { seededShuffle } from '@/lib/seededShuffle';

function AccordionItem({
  submission,
  player,
  comments,
  players,
  songUrl,
  musicServiceLabel,
}: {
  submission: SubmissionRow;
  player: PlayerInfo | undefined;
  comments: CommentRow[];
  players: Map<string, PlayerInfo>;
  songUrl: string | null;
  musicServiceLabel: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/50 last:border-0">
      <div className={`flex w-full items-center gap-3 pt-3 transition-[padding-bottom] duration-250 ease-out ${open ? 'pb-0' : 'pb-3'}`}>
        <button
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {submission.cover_art_url ? (
            <img src={submission.cover_art_url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
          ) : (
            <div className="h-12 w-12 shrink-0 rounded-lg bg-secondary" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{submission.song_name}</p>
            {submission.artist_name && <p className="text-xs text-muted-foreground">{submission.artist_name}</p>}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {songUrl && (
          <a href={songUrl} target="_blank" rel="noopener noreferrer" aria-label={`Search on ${musicServiceLabel}`} className="shrink-0 text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-250 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-3 pl-[60px]">
            {/* Submitter reveal */}
            <div className="mb-3">
              <span className="text-xs text-muted-foreground">Submitted by</span>
              {player && (
                <span className="ml-1.5 inline-flex items-center gap-1">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                    style={{ backgroundColor: player.avatar_color + '22', borderColor: player.avatar_color, borderWidth: 1 }}
                  >
                    {player.avatar}
                  </span>
                  <span className="text-xs font-semibold text-foreground">{player.name}</span>
                </span>
              )}
            </div>

            {/* Per-song comments */}
            {comments.length > 0 ? (
              <div>
                {comments.map((c) => {
                  const commenter = players.get(c.player_id);
                  return (
                    <div key={c.id} className="pb-3">
                      <div className="mb-1 flex items-center gap-2">
                        {commenter && (
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                            style={{ backgroundColor: commenter.avatar_color + '22', borderColor: commenter.avatar_color, borderWidth: 1 }}
                          >
                            {commenter.avatar}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-foreground">{commenter?.name ?? 'Unknown'}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{c.text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/60">No comments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultsPage({ sessionId, tapeId }: { sessionId: string; tapeId: string }) {
  const { player } = useAuthContext();

  const [sessionName, setSessionName] = useState('');
  const [tapeTitle, setTapeTitle] = useState('');
  const [tapePrompt, setTapePrompt] = useState('');
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [players, setPlayers] = useState<Map<string, PlayerInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [musicService, setMusicService] = useState<MusicPlatform | null>(null);

  const fetchData = useCallback(async () => {
    if (!sessionId || !tapeId || !player) return;

    const [sessionRes, tapeRes, subsRes, commentsRes, membersRes] = await Promise.all([
      supabase.from('sessions').select('name').eq('id', sessionId).single(),
      supabase.from('tapes').select('title, prompt').eq('id', tapeId).single(),
      supabase
        .from('submissions')
        .select('id, song_name, artist_name, player_id, deezer_id, cover_art_url')
        .eq('tape_id', tapeId),
      supabase
        .from('comments')
        .select('id, submission_id, text, player_id')
        .eq('tape_id', tapeId),
      supabase
        .from('session_players')
        .select('player_id, players(id, name, avatar, avatar_color)')
        .eq('session_id', sessionId),
    ]);

    if (sessionRes.data) setSessionName(sessionRes.data.name);
    if (tapeRes.data) {
      setTapeTitle(tapeRes.data.title);
      setTapePrompt(tapeRes.data.prompt);
      document.title = `${tapeRes.data.title} | Anonymix`;
    }

    const subs = subsRes.data ?? [];
    setSubmissions(seededShuffle(subs, tapeId));
    setComments(commentsRes.data ?? []);

    // Build player lookup
    const playerMap = new Map<string, PlayerInfo>();
    for (const m of membersRes.data ?? []) {
      const p = m.players as unknown as PlayerInfo | null;
      if (p) playerMap.set(p.id, p);
    }
    setPlayers(playerMap);

    setLoading(false);
  }, [sessionId, tapeId, player]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Spinner />
    );
  }

  const tapeComments = comments.filter((c) => c.submission_id === null);

  return (
    <div className="flex flex-1 flex-col">
      {/* Session context bar */}
      <div className="flex items-center border-b border-border px-4 py-3">
        <div className="h-5 w-5" />
        <h2 className="flex-1 text-center font-display text-sm font-semibold text-foreground">{sessionName}</h2>
        <div className="h-5 w-5" />
      </div>

      {/* Tape info */}
      <div className="px-4 py-3">
        <h2 className="font-display text-lg font-semibold leading-snug text-foreground">{tapeTitle}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{tapePrompt}</p>
      </div>

      {/* Listening — collapsible */}
      {submissions.length > 0 && (
        <Collapsible.Root defaultOpen>
          <Collapsible.Trigger className="flex w-full items-center justify-between border-t border-border px-4 py-2 text-xs font-medium text-muted-foreground [&[data-state=closed]>svg]:-rotate-90">
            <span>Listening</span>
            <ChevronDown className="h-3 w-3 transition-transform duration-200" />
          </Collapsible.Trigger>
          <Collapsible.Content className="data-[state=closed]:overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <ListeningSection
              songs={submissions}
              playlistTitle={tapeTitle}
              playlistDescription={tapePrompt}
              onServiceChange={setMusicService}
            />
          </Collapsible.Content>
        </Collapsible.Root>
      )}

      {/* Song accordion */}
      <div className="flex-1 border-t border-border px-4">
        {submissions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No songs submitted</p>
        ) : (
          submissions.map((s) => (
            <AccordionItem
              key={s.id}
              submission={s}
              player={players.get(s.player_id)}
              comments={comments.filter((c) => c.submission_id === s.id)}
              players={players}
              songUrl={musicService ? buildSongSearchUrl(s.song_name, s.artist_name, musicService) : null}
              musicServiceLabel={musicService ? PLATFORM_LABELS[musicService] : null}
            />
          ))
        )}

        {/* The Tape comments */}
        {tapeComments.length > 0 && (
          <div className="pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1.5">
              The Tape
            </p>
            {tapeComments.map((c) => {
              const commenter = players.get(c.player_id);
              return (
                <div key={c.id} className="py-1.5">
                  <div className="mb-1 flex items-center gap-2">
                    {commenter && (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-xs"
                        style={{ backgroundColor: commenter.avatar_color + '22', borderColor: commenter.avatar_color, borderWidth: 1 }}
                      >
                        {commenter.avatar}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-foreground">{commenter?.name ?? 'Unknown'}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">{c.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
