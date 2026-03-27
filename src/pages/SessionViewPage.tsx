import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Copy, ExternalLink, Search, Users, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { useSongSearch, type SongResult } from '@/hooks/useSongSearch';
import { StatusBadge } from '@/components/StatusBadge';
import { SubmissionProgress } from '@/components/SubmissionProgress';
import { cn } from '@/lib/utils';

interface TapeData {
  id: string;
  title: string;
  prompt: string;
  status: string;
  deadline: string | null;
}

interface SubmissionData {
  id: string;
  song_name: string;
  artist_name: string;
  player_id: string;
}

export function SessionViewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { player } = useAuthContext();

  const [sessionName, setSessionName] = useState('');
  const [tapes, setTapes] = useState<TapeData[]>([]);
  const [activeTapeIdx, setActiveTapeIdx] = useState(0);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [mySubmission, setMySubmission] = useState<SubmissionData | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string; avatar: string; avatarColor: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);

  // Submission form
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<SongResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { results, searching, search, clear } = useSongSearch();

  const activeTape = tapes[activeTapeIdx] ?? null;

  const fetchData = useCallback(async () => {
    if (!sessionId || !player) return;

    const { data: session } = await supabase
      .from('sessions')
      .select('name')
      .eq('id', sessionId)
      .single();

    if (session) setSessionName(session.name);

    // Fetch members
    const { data: memberRows } = await supabase
      .from('session_players')
      .select('player_id, players(id, name, avatar, avatar_color)')
      .eq('session_id', sessionId);

    setMembers(
      (memberRows ?? [])
        .map((m) => {
          const p = m.players as unknown as { id: string; name: string; avatar: string; avatar_color: string } | null;
          if (!p) return null;
          return { id: p.id, name: p.name, avatar: p.avatar, avatarColor: p.avatar_color };
        })
        .filter((p): p is { id: string; name: string; avatar: string; avatarColor: string } => p !== null),
    );

    const { data: tapeRows } = await supabase
      .from('tapes')
      .select('id, title, prompt, status, deadline')
      .eq('session_id', sessionId)
      .order('created_at');

    const fetchedTapes = tapeRows ?? [];
    setTapes(fetchedTapes);

    // Find first actionable tape
    const actionableIdx = fetchedTapes.findIndex(
      (t) => t.status === 'submitting' || t.status === 'commenting' || t.status === 'playlist_ready',
    );
    setActiveTapeIdx(actionableIdx >= 0 ? actionableIdx : fetchedTapes.length - 1);

    // Fetch submissions for all tapes
    if (fetchedTapes.length > 0) {
      const tapeIds = fetchedTapes.map((t) => t.id);
      const { data: subs } = await supabase
        .from('submissions')
        .select('id, song_name, artist_name, player_id, tape_id')
        .in('tape_id', tapeIds);

      setSubmissions(subs ?? []);
    }

    setLoading(false);
  }, [sessionId, player]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-open action from query param
  useEffect(() => {
    if (loading) return;
    const action = searchParams.get('action');
    if (action === 'submit' && activeTape?.status === 'submitting') {
      setShowSearch(true);
    }
  }, [loading, searchParams, activeTape]);

  // Derive my submission for active tape
  useEffect(() => {
    if (!activeTape || !player) {
      setMySubmission(null);
      return;
    }
    const mine = submissions.find(
      (s) => s.player_id === player.id && 'tape_id' in s && (s as unknown as { tape_id: string }).tape_id === activeTape.id,
    );
    setMySubmission(mine ?? null);
  }, [activeTape, submissions, player]);

  async function handleSubmit() {
    if (!activeTape || !player || !selectedSong) return;
    setSubmitting(true);
    setError(null);

    try {
      if (mySubmission) {
        // Update existing
        const { error: err } = await supabase
          .from('submissions')
          .update({ song_name: selectedSong.title, artist_name: selectedSong.artist })
          .eq('id', mySubmission.id);
        if (err) throw err;
      } else {
        // Insert new
        const { error: err } = await supabase.from('submissions').insert({
          tape_id: activeTape.id,
          player_id: player.id,
          song_name: selectedSong.title,
          artist_name: selectedSong.artist,
        });
        if (err) throw err;
      }

      await fetchData();
      setShowSearch(false);
      setSelectedSong(null);
      setQuery('');
      clear();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  // Copy playlist to clipboard for Tune My Music
  function copyPlaylist() {
    const tapeSubmissions = submissions.filter(
      (s) => 'tape_id' in s && (s as unknown as { tape_id: string }).tape_id === activeTape?.id,
    );
    const text = tapeSubmissions
      .map((s) => (s.artist_name ? `${s.artist_name} - ${s.song_name}` : s.song_name))
      .join('\n');
    navigator.clipboard?.writeText(text);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const tapeSubmissions = submissions.filter(
    (s) => 'tape_id' in s && (s as unknown as { tape_id: string }).tape_id === activeTape?.id,
  );

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Header */}
      <header className="relative flex items-center border-b border-border px-4 py-3">
        <button onClick={() => navigate('/')} className="w-8 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-display text-sm font-semibold">
          {sessionName}
        </h1>
        <button onClick={() => setShowMembers(true)} className="ml-auto w-8 text-muted-foreground hover:text-foreground">
          <Users className="ml-auto h-5 w-5" />
        </button>
      </header>

      {/* Crate centering — matches prototype: flex-1 flex items-center justify-center p-4 */}
      <div className="flex flex-1 items-center justify-center p-4">
        {/* Single crate container — matches prototype: w-full max-w-[375px] */}
        <div className="w-full max-w-[375px]">

          {/* Spines above active */}
          {tapes.length > 1 && activeTapeIdx > 0 && (
            <>
              {Array.from({ length: Math.min(activeTapeIdx, 4) }, (_, i) => {
                const idx = activeTapeIdx - (Math.min(activeTapeIdx, 4) - i);
                const distance = activeTapeIdx - idx;
                const width = Math.max(60, 100 - distance * distance * 0.5);
                return (
                  <div
                    key={`above-${idx}`}
                    onClick={() => setActiveTapeIdx(idx)}
                    className={cn(
                      'mx-auto mb-1 flex cursor-pointer items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-accent',
                      distance >= 4 ? 'h-5' : distance >= 3 ? 'h-7' : 'h-9',
                    )}
                    style={{ width: `${width}%`, opacity: 0.5 }}
                  >
                    {distance < 4 && (
                      <span className="truncate px-3 font-display text-[11px] font-medium text-muted-foreground">
                        {tapes[idx].title}
                      </span>
                    )}
                  </div>
                );
              })}
              <div className="mb-2" />
            </>
          )}

          {/* Active tape card */}
          {activeTape && (
            <div className="flex h-[260px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-md">
            {/* Card header: tape number + status badge with countdown */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tape {activeTapeIdx + 1}
              </span>
              <StatusBadge status={activeTape.status as 'submitting' | 'commenting' | 'playlist_ready' | 'results'} />
            </div>

            {/* Prompt */}
            <p className="font-display text-lg font-semibold leading-snug text-foreground">{activeTape.title}</p>
            <p className="mb-2 text-sm text-muted-foreground">{activeTape.prompt}</p>

            <div className="flex-1"></div> {/* spacer */}

            {/* State-specific content */}
            {activeTape.status === 'submitting' && (
              <>
                <SubmissionProgress submitted={tapeSubmissions.length} total={members.length || 1} />
                {mySubmission ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">Your pick</span>
                      <span className="text-sm font-medium text-foreground">
                        {mySubmission.song_name}{mySubmission.artist_name ? ` — ${mySubmission.artist_name}` : ''}
                      </span>
                    </div>
                    <button onClick={() => setShowSearch(true)} className="shrink-0 text-sm font-medium text-primary">
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-full rounded-xl bg-green-500 py-2.5 text-sm font-semibold text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
                  >
                    Submit your pick
                  </button>
                )}
              </>
            )}

            {activeTape.status === 'playlist_ready' && (
              <div className="mt-2 text-center">
                <p className="text-sm text-muted-foreground">{tapeSubmissions.length} songs ready to listen</p>
                <p className="mb-4 text-xs text-muted-foreground">Go listen, then come back to comment</p>
                <button
                  onClick={copyPlaylist}
                  className="w-full rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Copy playlist
                </button>
              </div>
            )}

            {activeTape.status === 'commenting' && (
              <>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    Commenting in progress
                  </span>
                </div>
                <div className="mb-3 h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: '0%' }} />
                </div>
                <button className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500">
                  Leave comments
                </button>
              </>
            )}

            {activeTape.status === 'results' && (
              <div className="mt-2">
                <button className="w-full rounded-xl bg-purple-500 py-2.5 text-sm font-semibold text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500">
                  See full results
                </button>
              </div>
            )}
          </div>
          )}

          {/* Spines below active */}
          {tapes.length > 1 && activeTapeIdx < tapes.length - 1 && (
            <>
              <div className="mt-2" />
              {Array.from(
                { length: Math.min(tapes.length - activeTapeIdx - 1, 4) },
                (_, i) => {
                  const idx = activeTapeIdx + 1 + i;
                  const distance = idx - activeTapeIdx;
                  const width = Math.max(60, 100 - distance * distance * 0.5);
                  return (
                    <div
                      key={`below-${idx}`}
                      onClick={() => setActiveTapeIdx(idx)}
                      className={cn(
                        'mx-auto mt-1 flex cursor-pointer items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-accent',
                        distance >= 4 ? 'h-5' : distance >= 3 ? 'h-7' : 'h-9',
                      )}
                      style={{ width: `${width}%`, opacity: 0.5 }}
                    >
                      {distance < 4 && (
                        <span className="truncate px-3 font-display text-[11px] font-medium text-muted-foreground">
                          {tapes[idx].title}
                        </span>
                      )}
                    </div>
                  );
                },
              )}
            </>
          )}

        </div>{/* end crate container */}
      </div>{/* end crate centering wrapper */}

      {/* Playlist song list below crate (for playlist_ready / results) */}
      {activeTape &&
        (activeTape.status === 'playlist_ready' || activeTape.status === 'results') &&
        tapeSubmissions.length > 0 && (
          <div className="mx-auto mt-4 w-full max-w-[375px] px-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Playlist ({tapeSubmissions.length} songs)
              </span>
              <button
                onClick={copyPlaylist}
                className="flex items-center gap-1 text-xs text-primary hover:opacity-80"
              >
                <Copy className="h-3 w-3" />
                Copy for Tune My Music
              </button>
            </div>
            <div className="space-y-2">
              {tapeSubmissions.map((s) => (
                <div key={s.id} className="rounded-lg border border-border bg-card px-3 py-2">
                  <p className="font-display text-sm font-semibold text-foreground">{s.song_name}</p>
                  {s.artist_name && <p className="text-xs text-muted-foreground">{s.artist_name}</p>}
                </div>
              ))}
            </div>
            <a
              href="https://www.tunemymusic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4" />
              Open Tune My Music
            </a>
          </div>
        )}

      {/* Members bottom sheet */}
      {showMembers && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={() => setShowMembers(false)} />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-h-[80vh] max-w-[428px] overflow-y-auto rounded-t-2xl bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="font-display text-base font-semibold">Members</h2>
              <button onClick={() => setShowMembers(false)} className="text-sm font-medium text-primary">
                Done
              </button>
            </div>
            <div className="px-4 py-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 py-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: m.avatarColor + '22', borderColor: m.avatarColor, borderWidth: 2 }}
                  >
                    {m.avatar}
                  </div>
                  <span className="text-sm font-medium text-foreground">{m.name}</span>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}/join/${sessionId}`);
                  setShowMembers(false);
                }}
                className="w-full rounded-xl border border-primary/20 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
              >
                Copy invite link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Song search overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {/* Header */}
          <header className="relative flex items-center border-b border-border px-4 py-3">
            <button
              onClick={() => {
                setShowSearch(false);
                setQuery('');
                setSelectedSong(null);
                clear();
              }}
              className="w-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <h2 className="font-display text-sm font-semibold">{activeTape?.title}</h2>
              <p className="text-[11px] text-muted-foreground">{sessionName}</p>
            </div>
            <div className="ml-auto w-8" />
          </header>

          {/* Prompt + deadline */}
          <div className="px-4 pt-5 pb-3">
            <h3 className="font-display text-xl font-semibold leading-snug text-foreground">
              {activeTape?.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{activeTape?.prompt}</p>
            {activeTape?.deadline && (
              <p className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">
                Due {new Date(activeTape.deadline).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Search input */}
          <div className="px-4">
            <div className="relative flex items-center rounded-xl border border-border bg-card transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-ring">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  search(e.target.value);
                  setSelectedSong(null);
                }}
                placeholder="Search for a song..."
                className="w-full rounded-xl bg-transparent py-2.5 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSelectedSong(null);
                    clear();
                  }}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete results */}
          {results.length > 0 && (
            <div className="mx-4 mt-1 max-h-[280px] overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedSong(r);
                    setQuery(`${r.artist} - ${r.title}`);
                    clear();
                  }}
                  className={cn(
                    'flex w-full flex-col border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent',
                    selectedSong?.id === r.id && 'bg-primary/10',
                  )}
                >
                  <span className="font-display text-sm font-semibold text-foreground">{r.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.artist}
                    {r.album && ` · ${r.album}`}
                  </span>
                </button>
              ))}
            </div>
          )}

          {searching && <p className="px-4 py-3 text-sm text-muted-foreground">Searching...</p>}

          {query.length >= 2 && !searching && results.length === 0 && !selectedSong && (
            <p className="px-4 py-3 text-sm text-muted-foreground">No results found</p>
          )}

          {/* Song preview + context note + submit */}
          {selectedSong && (
            <div className="px-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-lg bg-secondary" />
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-foreground">{selectedSong.title}</p>
                  <p className="text-sm text-muted-foreground">{selectedSong.artist}</p>
                </div>
              </div>
            </div>
          )}

          {/* Manual entry hint */}
          {!selectedSong && query.trim().length > 0 && !searching && (
            <button
              onClick={() => {
                const parts = query.split(' - ');
                if (parts.length >= 2) {
                  setSelectedSong({ id: 'manual', title: parts.slice(1).join(' - ').trim(), artist: parts[0].trim() });
                } else {
                  setSelectedSong({ id: 'manual', title: query.trim(), artist: '' });
                }
              }}
              className="mx-4 mt-3 text-center text-xs text-primary hover:opacity-80"
            >
              Use "{query.trim()}" as manual entry
            </button>
          )}

          {/* Bottom actions */}
          <div className="mt-auto border-t border-border p-4">
            {error && <p className="mb-2 text-center text-sm text-red-500">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!selectedSong || submitting}
              className="w-full rounded-xl bg-green-500 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-40 dark:bg-green-600 dark:hover:bg-green-500"
            >
              {submitting ? 'Submitting...' : mySubmission ? 'Change submission' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Success toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-background shadow-lg">
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Song submitted!</span>
        </div>
      )}
    </div>
  );
}
