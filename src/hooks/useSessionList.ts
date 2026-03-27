import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import type { SessionWithTape, Player, Tape, TapeStatus } from '@/lib/types';

interface UseSessionListResult {
  sessions: SessionWithTape[] | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Pick the "active" tape for a session:
 * first actionable (submitting/commenting/playlist_ready), else most recent.
 */
function pickActiveTape(tapes: Tape[]): Tape | null {
  const actionable = tapes.find(
    (t) => t.status === 'submitting' || t.status === 'commenting' || t.status === 'playlist_ready',
  );
  return actionable ?? tapes[tapes.length - 1] ?? null;
}

export function useSessionList(): UseSessionListResult {
  const { player } = useAuthContext();
  const playerId = player?.id;
  const [sessions, setSessions] = useState<SessionWithTape[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!playerId) return;
    try {
      // 1. Get sessions the current player is a member of
      const { data: myMemberships } = await supabase
        .from('session_players')
        .select('session_id')
        .eq('player_id', playerId);

      const mySessionIds = (myMemberships ?? []).map((m) => m.session_id);
      if (mySessionIds.length === 0) {
        setSessions([]);
        setLoading(false);
        return;
      }

      const { data: sessionRows, error: sessErr } = await supabase
        .from('sessions')
        .select('*')
        .in('id', mySessionIds)
        .order('created_at');

      if (sessErr) throw sessErr;
      if (!sessionRows) return;

      const sessionIds = sessionRows.map((s) => s.id);

      // 2. Get players for these sessions via join table
      const { data: membershipRows, error: memErr } = await supabase
        .from('session_players')
        .select('session_id, player_id, players(*)')
        .in('session_id', sessionIds);

      if (memErr) throw memErr;

      // 3. Get tapes for these sessions
      const { data: tapeRows, error: tapeErr } = await supabase
        .from('tapes')
        .select('*')
        .in('session_id', sessionIds)
        .order('created_at');

      if (tapeErr) throw tapeErr;

      // 4. Get submissions and comments for dev user action state
      const tapeIds = (tapeRows ?? []).map((t) => t.id);

      const [{ data: submissionRows }, { data: commentRows }] = await Promise.all([
        tapeIds.length > 0
          ? supabase
              .from('submissions')
              .select('tape_id')
              .eq('player_id', playerId)
              .in('tape_id', tapeIds)
          : { data: [] as { tape_id: string }[] },
        tapeIds.length > 0
          ? supabase
              .from('comments')
              .select('tape_id')
              .eq('player_id', playerId)
              .in('tape_id', tapeIds)
          : { data: [] as { tape_id: string }[] },
      ]);

      const submittedTapeIds = new Set((submissionRows ?? []).map((s) => s.tape_id));
      const commentedTapeIds = new Set((commentRows ?? []).map((c) => c.tape_id));

      // 5. Assemble SessionWithTape objects
      const result: SessionWithTape[] = sessionRows.map((session) => {
        // Players for this session
        const players: Player[] = (membershipRows ?? [])
          .filter((m) => m.session_id === session.id)
          .map((m) => {
            const p = m.players as unknown as {
              id: string;
              name: string;
              avatar: string;
              avatar_color: string;
            } | null;
            if (!p) return null;
            return {
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              avatarColor: p.avatar_color,
            };
          })
          .filter((p): p is Player => p !== null);

        // Tapes for this session
        const tapes: Tape[] = (tapeRows ?? [])
          .filter((t) => t.session_id === session.id)
          .map((t) => ({
            id: t.id,
            sessionId: t.session_id,
            title: t.title,
            prompt: t.prompt,
            status: t.status as TapeStatus,
            deadline: t.deadline ? new Date(t.deadline).getTime() : undefined,
            completedAt: t.completed_at ? new Date(t.completed_at).getTime() : undefined,
          }));

        const activeTape = pickActiveTape(tapes);

        // User action state
        let userActionDone = false;
        if (activeTape) {
          if (activeTape.status === 'submitting') {
            userActionDone = submittedTapeIds.has(activeTape.id);
          } else if (activeTape.status === 'commenting') {
            userActionDone = commentedTapeIds.has(activeTape.id);
          }
        }

        return {
          id: session.id,
          name: session.name,
          description: session.description,
          adminId: session.admin_id,
          ended: session.ended,
          activeTape,
          userActionDone,
          players,
        };
      });

      // Sort: deadline ascending (soonest first, no-deadline last)
      result.sort((a, b) => {
        const dA = a.activeTape?.deadline ?? Infinity;
        const dB = b.activeTape?.deadline ?? Infinity;
        return dA - dB;
      });

      setSessions(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    fetchSessions();

    // Real-time: refetch when tapes change
    const channel = supabase
      .channel('tapes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tapes' }, () => {
        fetchSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchSessions]);

  return { sessions, loading, error, refetch: fetchSessions };
}
