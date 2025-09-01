// This is a minimal service worker to make the app installable.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
});

self.addEventListener('fetch', (event) => {
  // This service worker doesn't intercept any requests.
  // It's just here to meet the PWA installability criteria.
  event.respondWith(fetch(event.request));
});
