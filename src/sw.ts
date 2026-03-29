/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute, type PrecacheEntry } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: (string | PrecacheEntry)[] };

// Workbox precaching (injected by vite-plugin-pwa)
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Runtime cache for Deezer album art
registerRoute(
  /^https:\/\/cdn-images\.dzcdn\.net\//,
  new CacheFirst({
    cacheName: 'album-art',
    plugins: [
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  }),
);

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json() as { title?: string; body?: string; url?: string };
  const title = data.title || 'Anonymix';
  const options: NotificationOptions = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler — open/focus app and navigate
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url || '/';

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      // Focus existing window if one exists
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          await client.focus();
          await client.navigate(url);
          return;
        }
      }
      // Otherwise open new window
      await self.clients.openWindow(url);
    })(),
  );
});
