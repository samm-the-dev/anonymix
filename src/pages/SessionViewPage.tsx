import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CalendarPlus, CassetteTape, CheckCircle, ChevronDown, MoreVertical, Search, Users, X } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { useSongSearch, type SongResult } from '@/hooks/useSongSearch';
import { StatusBadge } from '@/components/StatusBadge';
import { SubmissionProgress } from '@/components/SubmissionProgress';
import { cn } from '@/lib/utils';
import type { TapeStatus } from '@/lib/types';
import { computeExtendedDeadline } from '@/lib/extendDeadline';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { NotificationPrompt } from '@/components/NotificationPrompt';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface TapeData {
  id: string;
  title: string;
  prompt: string;
  status: TapeStatus;
  deadline: string | null;
}

interface SubmissionData {
  id: string;
  song_name: string;
  artist_name: string;
  player_id: string;
  musicbrainz_id: string | null;
  release_id: string | null;
  cover_art_url: string | null;
}

export function SessionViewPage() {
  const { sessionSlug } = useParams<{ sessionSlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { player } = useAuthContext();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [tapes, setTapes] = useState<TapeData[]>([]);
  const [activeTapeIdx, setActiveTapeIdx] = useState(0);
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [mySubmission, setMySubmission] = useState<SubmissionData | null>(null);
  const [members, setMembers] = useState<{ id: string; name: string; avatar: string; avatarColor: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [commentersCount, setCommentersCount] = useState(0);
  const [allComments, setAllComments] = useState<{ submission_id: string | null; player_id: string }[]>([]);

  // Submission form
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<SongResult | null>(null);
  const [coverArtUrl, setCoverArtUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const { permission, requestPermission, supported: notifSupported } = useNotificationPermission(player?.id);
  const { results, searching, search, clear } = useSongSearch();

  const activeTape = tapes[activeTapeIdx] ?? null;

  const fetchData = useCallback(async () => {
    if (!sessionSlug || !player) return;

    // Resolve slug → session
    const { data: session } = await supabase
      .from('sessions')
      .select('id, name, admin_id, slug, ended')
      .eq('slug', sessionSlug)
      .single();

    if (!session) return;
    const sessionId = session.id;
    setSessionId(sessionId);

    if (session) {
      setSessionName(session.name);
      setSessionEnded(session.ended);
      setIsHost(session.admin_id === player?.id);
      document.title = `${session.name} | Anonymix`;
    }

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
      (t) => t.status === 'submitting' || t.status === 'playlist_ready',
    );
    setActiveTapeIdx(actionableIdx >= 0 ? actionableIdx : fetchedTapes.length - 1);

    // Fetch submissions for all tapes
    if (fetchedTapes.length > 0) {
      const tapeIds = fetchedTapes.map((t) => t.id);
      const { data: subs } = await supabase
        .from('submissions')
        .select('id, song_name, artist_name, player_id, tape_id, musicbrainz_id, release_id, cover_art_url')
        .in('tape_id', tapeIds);

      setSubmissions(subs ?? []);
    }

    // Count distinct commenters on active tape
    const activeTapeForComments = fetchedTapes.find(
      (t) => t.status === 'playlist_ready',
    );
    if (activeTapeForComments) {
      const { data: commentRows } = await supabase
        .from('comments')
        .select('player_id')
        .eq('tape_id', activeTapeForComments.id);
      const distinct = new Set((commentRows ?? []).map((r) => r.player_id));
      setCommentersCount(distinct.size);
    }

    // Fetch all comments for summary when session is ended
    if (session.ended && fetchedTapes.length > 0) {
      const tapeIds = fetchedTapes.map((t) => t.id);
      const { data: comments } = await supabase
        .from('comments')
        .select('submission_id, player_id')
        .in('tape_id', tapeIds);
      setAllComments(comments ?? []);
    }

    setLoading(false);
  }, [sessionSlug, player]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-open action from query param
  useEffect(() => {
    if (loading) return;
    const action = searchParams.get('action');
    if (action === 'submit' && activeTape?.status === 'submitting') {
      // Find existing submission inline (mySubmission effect may not have run yet)
      const existing = submissions.find(
        (s) => s.player_id === player?.id && 'tape_id' in s && (s as unknown as { tape_id: string }).tape_id === activeTape.id,
      );
      setShowSearch(true);
      if (existing) {
        setQuery(`${existing.artist_name ? existing.artist_name + ' - ' : ''}${existing.song_name}`);
        setSelectedSong({
          id: existing.musicbrainz_id ?? 'manual',
          title: existing.song_name,
          artist: existing.artist_name,
          deezerId: existing.musicbrainz_id ?? undefined,
        });
        setCoverArtUrl(existing.cover_art_url);
      }
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

  async function extendDeadline() {
    if (!activeTape) return;
    const { error: err } = await supabase.from('tapes').update({
      deadline: computeExtendedDeadline(activeTape.deadline),
    }).eq('id', activeTape.id);
    if (err) console.error('extendDeadline failed:', err);
    await fetchData();
  }

  async function advanceTape() {
    if (!activeTape) return;
    if (activeTape.status === 'submitting') {
      await supabase.from('tapes').update({ status: 'playlist_ready' }).eq('id', activeTape.id);
      await fetchData();
    } else if (activeTape.status === 'playlist_ready') {
      await supabase.from('tapes').update({ status: 'results' }).eq('id', activeTape.id);
      navigate(`/${sessionSlug}/tape/${activeTapeIdx + 1}`);
    }
  }

  async function handleSubmit() {
    if (!activeTape || !player || !selectedSong) return;
    setSubmitting(true);
    setError(null);

    try {
      if (mySubmission) {
        // Update existing
        const { error: err } = await supabase
          .from('submissions')
          .update({
            song_name: selectedSong.title,
            artist_name: selectedSong.artist,
            musicbrainz_id: selectedSong.deezerId ?? null,
            release_id: null,
            cover_art_url: coverArtUrl,
          })
          .eq('id', mySubmission.id);
        if (err) throw err;
      } else {
        // Insert new
        const { error: err } = await supabase.from('submissions').insert({
          tape_id: activeTape.id,
          player_id: player.id,
          song_name: selectedSong.title,
          artist_name: selectedSong.artist,
          musicbrainz_id: selectedSong.deezerId ?? null,
          release_id: null,
          cover_art_url: coverArtUrl,
        });
        if (err) throw err;
      }

      await fetchData();
      setShowSearch(false);
      setSelectedSong(null);
      setCoverArtUrl(null);
      setQuery('');
      clear();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);

      // Show notification prompt after first submission if not yet granted
      if (notifSupported && permission === 'default') {
        setTimeout(() => setShowNotifPrompt(true), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  const tapeSubmissions = submissions.filter(
    (s) => 'tape_id' in s && (s as unknown as { tape_id: string }).tape_id === activeTape?.id,
  );

  // Summary stats for completed sessions
  const summary = sessionEnded ? (() => {
    const tapesCompleted = tapes.filter((t) => t.status === 'results').length;
    const totalSongs = submissions.length;
    const totalComments = allComments.length;

    // Most-commented songs
    const commentsBySub = new Map<string, number>();
    for (const c of allComments) {
      if (c.submission_id) {
        commentsBySub.set(c.submission_id, (commentsBySub.get(c.submission_id) ?? 0) + 1);
      }
    }
    const maxSongComments = Math.max(0, ...commentsBySub.values());
    const topSongs = maxSongComments > 0
      ? submissions.filter((s) => commentsBySub.get(s.id) === maxSongComments)
      : [];

    // Most active commenters
    const commentsByPlayer = new Map<string, number>();
    for (const c of allComments) {
      commentsByPlayer.set(c.player_id, (commentsByPlayer.get(c.player_id) ?? 0) + 1);
    }
    const maxPlayerComments = Math.max(0, ...commentsByPlayer.values());
    const topCommenters = maxPlayerComments > 0
      ? members.filter((m) => commentsByPlayer.get(m.id) === maxPlayerComments)
      : [];

    return { tapesCompleted, totalSongs, totalComments, topSongs, maxSongComments, topCommenters, maxPlayerComments };
  })() : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const deadlinePassed = activeTape?.deadline ? new Date(activeTape.deadline).getTime() < Date.now() : false;

  return (
    <div className="flex flex-1 flex-col">
      {/* Session context bar */}
      <div className="flex items-center border-b border-border px-4 py-3">
        <div className="h-5 w-5" />
        <h2 className="flex-1 text-center font-display text-sm font-semibold text-foreground">{sessionName}</h2>
        <button onClick={() => setShowMembers(true)} className="text-muted-foreground hover:text-foreground">
          <Users className="h-5 w-5" />
        </button>
      </div>

      {/* Session summary for completed sessions */}
      {summary && (
        <Collapsible.Root defaultOpen asChild>
          <div className="border-b border-border">
            <Collapsible.Trigger className="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground [&[data-state=closed]>svg]:-rotate-90">
              <span>Session Complete</span>
              <ChevronDown className="h-3 w-3 transition-transform duration-200" />
            </Collapsible.Trigger>
            <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <div className="px-4 pb-3">
                {/* Totals */}
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{summary.tapesCompleted} tape{summary.tapesCompleted !== 1 ? 's' : ''}</span>
                  <span>{summary.totalSongs} song{summary.totalSongs !== 1 ? 's' : ''}</span>
                  <span>{summary.totalComments} comment{summary.totalComments !== 1 ? 's' : ''}</span>
                </div>

                {/* Most-commented songs */}
                {summary.topSongs.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Most commented</p>
                    {summary.topSongs.map((s) => (
                      <div key={s.id} className="mt-1 flex items-center gap-2">
                        {s.cover_art_url ? (
                          <img src={s.cover_art_url} alt="" className="h-6 w-6 shrink-0 rounded object-cover" />
                        ) : (
                          <div className="h-6 w-6 shrink-0 rounded bg-secondary" />
                        )}
                        <span className="truncate text-xs font-medium text-foreground">{s.song_name}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{summary.maxSongComments}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Most active commenters */}
                {summary.topCommenters.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Most active</p>
                    {summary.topCommenters.map((m) => (
                      <div key={m.id} className="mt-1 flex items-center gap-2">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                          style={{ backgroundColor: m.avatarColor + '22', borderColor: m.avatarColor, borderWidth: 1 }}
                        >
                          {m.avatar}
                        </span>
                        <span className="text-xs font-medium text-foreground">{m.name}</span>
                        <span className="text-[10px] text-muted-foreground">{summary.maxPlayerComments} comments</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Collapsible.Content>
          </div>
        </Collapsible.Root>
      )}

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
            <div className="flex h-[260px] flex-col rounded-2xl border border-border bg-card p-4 shadow-md">
            {/* Card header: tape number + status badge + host menu */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase leading-none tracking-wider text-muted-foreground">
                Tape {activeTapeIdx + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <StatusBadge status={activeTape.status} />
                {isHost && (activeTape.status === 'submitting' || activeTape.status === 'playlist_ready') && (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        align="end"
                        sideOffset={4}
                        className="z-50 overflow-hidden rounded-lg border border-border bg-background shadow-lg"
                      >
                        <DropdownMenu.Item
                          onSelect={extendDeadline}
                          className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-sm text-foreground outline-none hover:bg-accent focus:bg-accent"
                        >
                          <CalendarPlus className="h-4 w-4" />
                          Wait another day
                        </DropdownMenu.Item>
                        {activeTape.status === 'submitting' && tapeSubmissions.length >= 2 && (
                          <DropdownMenu.Item
                            onSelect={() => setShowLockConfirm(true)}
                            className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-sm text-foreground outline-none hover:bg-accent focus:bg-accent"
                          >
                            <CassetteTape className="h-4 w-4 text-violet-400" />
                            Lock in submissions
                          </DropdownMenu.Item>
                        )}
                        {activeTape.status === 'playlist_ready' && tapeSubmissions.length >= 2 && (
                          <DropdownMenu.Item
                            onSelect={() => setShowLockConfirm(true)}
                            className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-sm text-foreground outline-none hover:bg-accent focus:bg-accent"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Complete
                          </DropdownMenu.Item>
                        )}
                        {import.meta.env.DEV && (
                          <DropdownMenu.Item
                            onSelect={async () => {
                              await supabase.from('tapes').update({ status: 'skipped' }).eq('id', activeTape.id);
                              await fetchData();
                            }}
                            className="flex cursor-pointer items-center gap-2 whitespace-nowrap px-3 py-2 text-sm text-red-400 outline-none hover:bg-accent focus:bg-accent"
                          >
                            Skip tape (dev)
                          </DropdownMenu.Item>
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                )}
              </div>
            </div>

            {/* Prompt */}
            <p className="font-display text-lg font-semibold leading-snug text-foreground">{activeTape.title}</p>
            <p className="mb-2 text-sm text-muted-foreground">{activeTape.prompt}</p>

            {/* Deadline info */}
            {activeTape.status === 'submitting' && (
              <p className="mb-1 text-xs text-muted-foreground">
                {!activeTape.deadline
                  ? 'Waiting for first submission'
                  : new Date(activeTape.deadline).getTime() < Date.now()
                    ? 'Submissions closing...'
                    : `Due ${new Date(activeTape.deadline).toLocaleDateString()}`}
              </p>
            )}
            {activeTape.status === 'playlist_ready' && activeTape.deadline && (
              <p className="mb-1 text-xs text-muted-foreground">
                {new Date(activeTape.deadline).getTime() < Date.now()
                  ? 'Completing...'
                  : `Due ${new Date(activeTape.deadline).toLocaleDateString()}`}
              </p>
            )}

            <div className="flex-1"></div> {/* spacer */}

            {/* State-specific content */}
            {activeTape.status === 'submitting' && (
              <>
                <SubmissionProgress submitted={tapeSubmissions.length} total={members.length || 1} />
                {mySubmission ? (
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">Your pick</span>
                      <span className="block truncate text-sm font-medium text-foreground">
                        {mySubmission.song_name}{mySubmission.artist_name ? ` - ${mySubmission.artist_name}` : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowSearch(true);
                        setQuery(`${mySubmission.artist_name ? mySubmission.artist_name + ' - ' : ''}${mySubmission.song_name}`);
                        setSelectedSong({
                          id: mySubmission.musicbrainz_id ?? 'manual',
                          title: mySubmission.song_name,
                          artist: mySubmission.artist_name,
                          deezerId: mySubmission.musicbrainz_id ?? undefined,
                        });
                        setCoverArtUrl(mySubmission.cover_art_url);
                      }}
                      className="shrink-0 text-sm font-medium text-primary">
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    disabled={deadlinePassed}
                    className="w-full rounded-xl bg-green-500 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-40 dark:bg-green-600 dark:hover:bg-green-500"
                  >
                    {deadlinePassed ? 'Submissions closing...' : 'Submit your pick'}
                  </button>
                )}
              </>
            )}

            {activeTape.status === 'playlist_ready' && tapeSubmissions.length > 0 && (
              <div className="mt-2">
                <SubmissionProgress submitted={commentersCount} total={members.length || 1} colorClass="bg-amber-500" textColorClass="text-amber-600 dark:text-amber-400" />
                <button
                  onClick={() => navigate(`/${sessionSlug}/tape/${activeTapeIdx + 1}`)}
                  className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
                >
                  Listen &amp; Comment
                </button>
              </div>
            )}
            {activeTape.status === 'playlist_ready' && tapeSubmissions.length === 0 && (
              <p className="mt-2 text-center text-xs text-muted-foreground">No one submitted this round</p>
            )}

            {activeTape.status === 'upcoming' && (
              <p className="mt-2 text-center text-xs text-muted-foreground">Coming up...</p>
            )}

            {activeTape.status === 'skipped' && (
              <p className="mt-2 text-center text-xs text-muted-foreground">Skipped - no submissions</p>
            )}

            {activeTape.status === 'results' && (
              <div className="mt-2">
                <button
                  onClick={() => navigate(`/${sessionSlug}/tape/${activeTapeIdx + 1}`)}
                  className="w-full rounded-xl bg-purple-500 py-2.5 text-sm font-semibold text-white hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500"
                >
                  View Comments
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


      {/* Members bottom sheet */}
      {showMembers && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={() => setShowMembers(false)} />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-h-[80vh] max-w-lg overflow-y-auto rounded-t-2xl bg-card">
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

      {/* Lock confirm dialog */}
      <AlertDialog.Root open={showLockConfirm} onOpenChange={setShowLockConfirm}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5">
            <AlertDialog.Title className="font-display text-base font-semibold text-foreground">
              {activeTape?.status === 'submitting' ? 'Lock in submissions?' : 'Complete this tape?'}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-1 text-sm text-muted-foreground">
              {activeTape?.status === 'submitting'
                ? 'This will close submissions and move to the listening phase. Players who haven\'t submitted will miss this round.'
                : 'This will end the listening phase and reveal who submitted each song.'}
            </AlertDialog.Description>
            <div className="mt-5 flex gap-2">
              <AlertDialog.Cancel asChild>
                <button className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-accent">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={advanceTape}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Confirm
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

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
              <h2 className="font-display text-sm font-semibold">{sessionName}</h2>
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
                    setCoverArtUrl(r.coverArtUrl ?? null);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-accent',
                    selectedSong?.id === r.id && 'bg-primary/10',
                  )}
                >
                  {r.coverArtUrl ? (
                    <img src={r.coverArtUrl} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded bg-secondary" />
                  )}
                  <div className="min-w-0">
                    <span className="block font-display text-sm font-semibold text-foreground">{r.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {r.artist}
                      {r.album && ` · ${r.album}`}
                    </span>
                  </div>
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
                {coverArtUrl ? (
                  <img src={coverArtUrl} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-secondary" />
                )}
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

      {/* Notification pre-prompt */}
      {showNotifPrompt && (
        <NotificationPrompt
          onAllow={async () => {
            setShowNotifPrompt(false);
            await requestPermission();
          }}
          onDismiss={() => setShowNotifPrompt(false)}
        />
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
