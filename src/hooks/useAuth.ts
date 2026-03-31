import { useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Player } from '@/lib/types';

interface AuthState {
  user: User | null;
  player: Player | null;
  loading: boolean;
  needsProfile: boolean;
}

type OAuthProvider = 'spotify' | 'google';

interface UseAuthResult extends AuthState {
  signInWithProvider: (provider: OAuthProvider) => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  createPlayer: (name: string, avatar: string, avatarColor: string) => Promise<void>;
  updatePlayer: (name: string, avatar: string, avatarColor: string) => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [state, setState] = useState<AuthState>({
    user: null,
    player: null,
    loading: true,
    needsProfile: false,
  });

  const fetchPlayer = useCallback(async (user: User) => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (data) {
      setState({
        user,
        player: {
          id: data.id,
          name: data.name,
          avatar: data.avatar,
          avatarColor: data.avatar_color,
        },
        loading: false,
        needsProfile: false,
      });
    } else {
      setState({ user, player: null, loading: false, needsProfile: true });
    }
  }, []);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchPlayer(session.user);
      } else {
        setState({ user: null, player: null, loading: false, needsProfile: false });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchPlayer(session.user);
      } else {
        setState({ user: null, player: null, loading: false, needsProfile: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchPlayer]);

  const signInWithMagicLink = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + (localStorage.getItem('anonymix-pending-path') ?? ''),
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signInWithProvider = useCallback(async (provider: OAuthProvider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const createPlayer = useCallback(
    async (name: string, avatar: string, avatarColor: string) => {
      if (!state.user) return;

      const { data, error } = await supabase
        .from('players')
        .insert({ name, avatar, avatar_color: avatarColor, auth_id: state.user.id })
        .select()
        .single();

      if (error) throw error;

      setState((prev) => ({
        ...prev,
        player: {
          id: data.id,
          name: data.name,
          avatar: data.avatar,
          avatarColor: data.avatar_color,
        },
        needsProfile: false,
      }));
    },
    [state.user],
  );

  const updatePlayer = useCallback(
    async (name: string, avatar: string, avatarColor: string) => {
      if (!state.player) return;

      const { error } = await supabase
        .from('players')
        .update({ name, avatar, avatar_color: avatarColor })
        .eq('id', state.player.id);

      if (error) throw error;

      setState((prev) => ({
        ...prev,
        player: prev.player ? { ...prev.player, name, avatar, avatarColor } : null,
      }));
    },
    [state.player],
  );

  return { ...state, signInWithProvider, signInWithMagicLink, signOut, createPlayer, updatePlayer };
}
