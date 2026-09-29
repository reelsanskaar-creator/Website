const CACHE_NAME = 'jgv-exam-portal-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install Event: કેશ ફાઇલો સેવ કરવી
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: જૂના કેશને ડિલીટ કરવા
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: ઇન્ટરનેટ વગર પણ કેશમાંથી ફાસ્ટ ડેટા પૂરો પાડવો
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // જો ઇન્ટરનેટ ન હોય તો અહીં ઓફલાઇન પેજ રજૂ કરી શકાય
      });
    })
  );
});
