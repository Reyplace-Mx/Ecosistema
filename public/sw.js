const CACHE_NAME = 'reyplace-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core application shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network First with Cache Fallback for dynamic app resources
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip browser extension requests or non-http(s)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful network responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        console.log('[SW] Network request failed, returning cached version:', event.request.url);
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Offline navigation fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }

        return new Response('Red no disponible. Módulo operando en modo Offline Cúpula.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
  );
});

// ==========================================================
// Web Push Notifications & Alerts for Reyplace Ecosystem
// ==========================================================

// Push Event: Received push payload from server / Cloud messaging
self.addEventListener('push', (event) => {
  console.log('[SW Push] Push message received:', event);

  let payload = {
    title: 'Reyplace Ecosistema',
    body: 'Nueva actualización en tus módulos suscritos.',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    module: 'smart_city',
    url: '/'
  };

  if (event.data) {
    try {
      const data = event.data.json();
      payload = { ...payload, ...data };
    } catch {
      payload.body = event.data.text() || payload.body;
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: payload.icon || '/icon-192.svg',
    badge: payload.badge || '/icon-192.svg',
    vibrate: [100, 50, 100],
    data: {
      url: payload.url || '/',
      module: payload.module || 'smart_city',
      timestamp: Date.now()
    },
    actions: [
      { action: 'open_module', title: 'Abrir Módulo' },
      { action: 'dismiss', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// Notification Click Event: Focus or Open Window
self.addEventListener('notificationclick', (event) => {
  console.log('[SW Push] Notification clicked:', event.action, event.notification);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NAVIGATE_TO_MODULE',
            module: event.notification.data?.module || 'smart_city'
          });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Push Subscription Change Event
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW Push] Push subscription changed:', event);
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then((newSubscription) => {
        console.log('[SW Push] Re-subscribed to push manager:', newSubscription.endpoint);
      })
  );
});

