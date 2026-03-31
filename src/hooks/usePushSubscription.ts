import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Player } from '@/lib/types';

type PermissionState = NotificationPermission | 'unsupported';

interface UsePushSubscriptionResult {
  /** Current Notification.permission (or 'unsupported' if push not available) */
  permission: PermissionState;
  /** Whether this device has an active subscription saved in the DB */
  subscribed: boolean;
  /** Loading state for subscribe/unsubscribe operations */
  loading: boolean;
  /** Subscribe this device to push notifications */
  subscribe: () => Promise<void>;
  /** Unsubscribe this device from push notifications */
  unsubscribe: () => Promise<void>;
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** Convert a base64 URL-safe string to a Uint8Array (for applicationServerKey) */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function usePushSubscription(player: Player | null): UsePushSubscriptionResult {
  const [permission, setPermission] = useState<PermissionState>(() =>
    isPushSupported() ? Notification.permission : 'unsupported',
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if this device already has a subscription stored in the DB
  useEffect(() => {
    if (!player || !isPushSupported()) return;

    let cancelled = false;

    (async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        if (cancelled) return;

        if (!existing) {
          setSubscribed(false);
          return;
        }

        // Check if this endpoint is in the DB for this player
        const { data } = await supabase
          .from('push_subscriptions')
          .select('id')
          .eq('player_id', player.id)
          .eq('endpoint', existing.endpoint)
          .maybeSingle();

        if (!cancelled) setSubscribed(!!data);
      } catch {
        // Silently fail — push just won't show as active
      }
    })();

    return () => { cancelled = true; };
  }, [player]);

  const subscribe = useCallback(async () => {
    if (!player || !isPushSupported() || !VAPID_PUBLIC_KEY) return;

    setLoading(true);
    try {
      // Request permission if not already granted
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') return;

      const reg = await navigator.serviceWorker.ready;

      // Subscribe via PushManager
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const key = sub.getKey('p256dh');
      const auth = sub.getKey('auth');
      if (!key || !auth) throw new Error('Missing push subscription keys');

      // base64url-encode the keys
      const p256dh = btoa(String.fromCharCode(...new Uint8Array(key)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const authStr = btoa(String.fromCharCode(...new Uint8Array(auth)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      // Upsert into Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(
          { player_id: player.id, endpoint: sub.endpoint, p256dh, auth: authStr },
          { onConflict: 'player_id,endpoint' },
        );

      if (error) throw error;
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  }, [player]);

  const unsubscribe = useCallback(async () => {
    if (!player || !isPushSupported()) return;

    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub) {
        // Remove from DB
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('player_id', player.id)
          .eq('endpoint', sub.endpoint);

        // Unsubscribe from browser
        await sub.unsubscribe();
      }

      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [player]);

  return { permission, subscribed, loading, subscribe, unsubscribe };
}
