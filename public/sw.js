// Service Worker - Push értesítések kezelése (JAVÍTOTT)

const CACHE_NAME = 'szakichat-v4-20251225-2215';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/rooms.html',
  '/chat.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('❌ Cache hiba:', err))
  );
  self.skipWaiting();
});

// Üzenetkezelő: azonnali skipWaiting, ha a kliens kéri
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    // Opcionális: minden kliensnek reload üzenet
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({ type: 'RELOAD_PAGE' }));
    });
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {

            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch esemény (offline támogatás)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache találat - visszaadjuk
        if (response) {
          return response;
        }
        // Hálózatról töltjük le
        return fetch(event.request).catch(() => {
          // Ha offline vagyunk, próbáljuk a cache-ből
          return caches.match('/index.html');
        });
      })
  );
});

// Push értesítés fogadása (ha lesz FCM)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SzakiChat';
  const options = {
    body: data.body || 'Új esemény történt!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'szakichat-notification',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || 'https://szakichat.hu'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Értesítésre kattintás kezelése
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || 'https://szakichat.hu';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Ha van nyitott ablak, azt fókuszáljuk
        for (let client of windowClients) {
          if (client.url.includes('szakichat.hu') && 'focus' in client) {
            return client.focus().then(() => client.navigate(urlToOpen));
          }
        }
        // Ha nincs nyitott ablak, új ablakot nyitunk
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
