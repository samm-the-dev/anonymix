import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';

interface InviteData {
  sessionName: string;
  description: string;
  adminName: string;
  memberCount: number;
  members: { avatar: string; avatarColor: string }[];
  tapes: { title: string; prompt: string }[];
}

export function JoinSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { player } = useAuthContext();
  const { theme, toggleTheme } = useTheme();

  const [invite, setInvite] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTimer, setIsFirstTimer] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    async function fetchInvite(sid: string) {
      const { data: session } = await supabase
        .from('sessions')
        .select('name, description, admin_id, players:session_players(player_id, players(name, avatar, avatar_color))')
        .eq('id', sid)
        .single();

      if (!session) {
        setError('Session not found');
        setLoading(false);
        return;
      }

      const { data: admin } = await supabase
        .from('players')
        .select('name')
        .eq('id', session.admin_id)
        .single();

      const { data: tapes } = await supabase
        .from('tapes')
        .select('title, prompt')
        .eq('session_id', sid)
        .order('created_at');

      const members = (session.players as unknown as { player_id: string; players: { name: string; avatar: string; avatar_color: string } | null }[]) ?? [];

      setInvite({
        sessionName: session.name,
        description: session.description,
        adminName: admin?.name ?? 'Someone',
        memberCount: members.length,
        members: members
          .filter((m) => m.players !== null)
          .map((m) => ({
            avatar: m.players!.avatar,
            avatarColor: m.players!.avatar_color,
          })),
        tapes: (tapes ?? []).map((t) => ({ title: t.title, prompt: t.prompt })),
      });

      if (player) {
        // Check if already a member of this session — redirect to session view
        const { data: alreadyMember } = await supabase
          .from('session_players')
          .select('player_id')
          .eq('session_id', sid)
          .eq('player_id', player.id)
          .single();

        if (alreadyMember) {
          navigate(`/session/${sid}`, { replace: true });
          return;
        }

        // Check if user has any existing sessions (first-timer check)
        const { count } = await supabase
          .from('session_players')
          .select('*', { count: 'exact', head: true })
          .eq('player_id', player.id);
        setIsFirstTimer((count ?? 0) === 0);
      }

      setLoading(false);
    }

    fetchInvite(sessionId);
  }, [sessionId, player, navigate]);

  async function handleJoin() {
    if (!player || !sessionId) return;
    setJoining(true);
    setError(null);

    try {
      // Check if already a member
      const { data: existing } = await supabase
        .from('session_players')
        .select('player_id')
        .eq('session_id', sessionId)
        .eq('player_id', player.id)
        .single();

      if (existing) {
        // Already a member, just navigate
        navigate(`/session/${sessionId}`, { replace: true });
        return;
      }

      // Join
      const { error: joinErr } = await supabase
        .from('session_players')
        .insert({ session_id: sessionId, player_id: player.id });

      if (joinErr) throw joinErr;

      navigate(`/session/${sessionId}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="text-lg font-medium text-foreground">Session not found</p>
        <p className="mt-1 text-sm text-muted-foreground">This invite link may have expired.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
        >
          Go home
        </button>
      </div>
    );
  }

  // If not logged in, the auth gate in App.tsx handles redirect
  // If logged in but no profile, profile setup handles it
  // If fully authed, show the join page

  const shownTapes = invite.tapes.slice(0, 3);
  const remainingTapes = invite.tapes.length - shownTapes.length;

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[428px] flex-col items-center justify-center px-6">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      {/* Invited by */}
      <p className="text-sm text-muted-foreground">
        {invite.adminName} invited you to join
      </p>

      {/* Session name */}
      <h1 className="mt-1 text-center font-display text-2xl font-bold text-foreground">
        {invite.sessionName}
      </h1>

      {/* Description */}
      {invite.description && (
        <p className="mt-1 text-center text-sm text-muted-foreground">{invite.description}</p>
      )}

      {/* Member avatars */}
      <div className="mt-4 flex items-center justify-center">
        {invite.members.map((m, i) => (
          <div
            key={i}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-background text-sm ${i > 0 ? '-ml-2' : ''}`}
            style={{ backgroundColor: m.avatarColor + '33' }}
          >
            {m.avatar}
          </div>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          {invite.memberCount} member{invite.memberCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tape previews */}
      {shownTapes.length > 0 && (
        <div className="mt-5 w-full">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tapes
          </p>
          <div className="space-y-1.5">
            {shownTapes.map((t, i) => (
              <div key={i}>
                <p className="font-display text-sm font-semibold text-foreground">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.prompt}</p>
              </div>
            ))}
            {remainingTapes > 0 && (
              <p className="text-xs text-muted-foreground">+{remainingTapes} more</p>
            )}
          </div>
        </div>
      )}

      {/* Explainer for first-timers */}
      {isFirstTimer && (
        <div className="mt-5 w-full text-center text-xs leading-relaxed text-muted-foreground">
          <p className="mb-1.5">For each Tape you'll:</p>
          <ul className="inline-block list-disc space-y-1 pl-4 text-left">
            <li>Anonymously contribute to a playlist around the theme</li>
            <li>Comment on the playlist picks once you've listened</li>
            <li>See all submitters and comments once comments are in</li>
          </ul>
        </div>
      )}

      {/* Join button */}
      {player ? (
        <div className="mt-6 w-full">
          {error && <p className="mb-3 text-center text-sm text-red-500">{error}</p>}
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full rounded-xl bg-primary py-3 text-base font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {joining ? 'Joining...' : 'Join Session'}
          </button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Sign in to join this session.
        </p>
      )}
    </div>
  );
}
