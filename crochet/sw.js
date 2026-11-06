// ═══════════════════════════════════════════════════════
// Service Worker — CROCHETA PWA v7.2
// Full Offline Caching, Background Sync, Fast Navigation
// ═══════════════════════════════════════════════════════

const CACHE_VERSION = 'crocheta-v7.2';
const STATIC_CACHE = `crocheta-static-${CACHE_VERSION}`;
const CDN_CACHE = `crocheta-cdn-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './patterns.js',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/app-logo.jpg',
  './icons/crocheta-logo.png'
];

const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js'
];

// ── 1. Install: Pre-cache static shell & CDN assets ──────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(async (cache) => {
        for (const asset of STATIC_ASSETS) {
          try {
            await cache.add(asset);
          } catch (err) {
            console.warn('[SW] Optional pre-cache skip:', asset, err.message);
          }
        }
      }),
      caches.open(CDN_CACHE).then(async (cache) => {
        for (const url of CDN_ASSETS) {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn('[SW] CDN pre-cache skip:', url);
          }
        }
      })
    ])
  );
});

// ── 2. Activate: Clean up old version caches ─────────────
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, CDN_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !currentCaches.includes(key))
          .map((key) => {
            console.log('[SW] Deleting obsolete cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── 3. Fetch Handler: Offline Support & Smart Caching ────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass non-GET and API / live reload endpoints
  if (req.method !== 'GET') return;
  if (url.pathname.includes('/api/') || 
      url.pathname.includes('/check-reload') ||
      url.hostname.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // CDN & External Resources: Cache-First with Network fallback
  if (url.hostname.includes('cdn.jsdelivr') ||
      url.hostname.includes('cdnjs.cloudflare') ||
      url.hostname.includes('fonts.googleapis') ||
      url.hostname.includes('fonts.gstatic')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.ok) {
            const clone = networkRes.clone();
            caches.open(CDN_CACHE).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        }).catch(() => cached || Response.error());
      })
    );
    return;
  }

  // Local App Shell: Network-First, fallback to Cache for offline
  if (url.origin === self.location.origin || url.protocol === 'file:') {
    event.respondWith(
      fetch(req).then((networkRes) => {
        if (networkRes && networkRes.ok) {
          const clone = networkRes.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      }).catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;

        // If navigating and offline, return the cached index.html
        if (req.mode === 'navigate') {
          const indexCached = await caches.match('./index.html') || await caches.match('/');
          if (indexCached) return indexCached;
        }

        return new Response('Offline - No connection available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
    );
  }
});

// ── 4. Message Handler ──────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

