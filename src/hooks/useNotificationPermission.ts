import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

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
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined,
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
      } catch {
        // Push subscription may fail without VAPID key — that's OK for now
      }
      return true;
    }

    return false;
  }, [playerId]);

  return { permission, requestPermission, supported: 'Notification' in window };
}
