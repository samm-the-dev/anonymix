import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function useNotificationPermission(playerId: string | undefined) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied',
  );

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !playerId) return false;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
            ? urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY) as BufferSource
            : undefined,
        });

        const json = subscription.toJSON();
        if (json.endpoint && json.keys) {
          await supabase.from('push_subscriptions').upsert(
            {
              player_id: playerId,
              endpoint: json.endpoint,
              p256dh: json.keys.p256dh!,
              auth: json.keys.auth!,
            },
            { onConflict: 'player_id,endpoint' },
          );
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('[Push] subscription failed', err);
      }
      return true;
    }

    return false;
  }, [playerId]);

  return { permission, requestPermission, supported: 'Notification' in window };
}
