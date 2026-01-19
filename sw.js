const CACHE_NAME = 'kniffel-v93';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './version.json',
  // CSS files
  './css/main.css',
  './css/variables.css',
  './css/base.css',
  './css/utilities.css',
  './css/components/buttons.css',
  './css/components/cards.css',
  './css/components/modals.css',
  './css/components/forms.css',
  './css/components/player.css',
  './css/components/dice.css',
  './css/components/scores.css',
  './css/components/menu.css',
  './css/components/animations.css',
  // JS modules
  './js/app.js',
  './js/state.js',
  './js/constants.js',
  './js/router.js',
  './js/utils/scoring.js',
  './js/utils/storage.js',
  './js/utils/helpers.js',
  './js/services/dice.js',
  './js/services/toast.js',
  './js/services/fireworks.js',
  './js/services/export.js',
  './js/services/pwa.js',
  './js/views/setup.js',
  './js/views/game.js',
  './js/views/history.js',
  './js/views/endScreen.js',
  './js/views/components/modal.js',
  './js/views/components/playerCard.js',
  './js/views/components/scoreRow.js',
  './js/views/components/diceArea.js',
  './js/views/components/sideMenu.js',
  './js/views/components/picker.js',
  './js/views/components/standings.js',
  // Assets
  './icon-192-v2.png',
  './icon-512-v2.png',
  './fireworks.webp'
];

// Install service worker and cache files
self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Clean up old caches and take control immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Listen for messages from the page
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
