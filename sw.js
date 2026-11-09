// ==========================================================================
// DAEM PWA Service Worker (Offline Cache & Network Engine)
// ==========================================================================

const CACHE_NAME = 'daem-core-v53.0';

// ----------------------------------------------------
// مرحلة التثبيت: Install Event (تخطي الانتظار فورا)
// ----------------------------------------------------
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// ----------------------------------------------------
// مرحلة التفعيل: Activate Event (حذف كافة الكاش القديم فورا)
// ----------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ----------------------------------------------------
// مرحلة جلب الطلبات: Fetch Event (إستراتيجية ذكية)
// ----------------------------------------------------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = req.url;

  // 1. تجاوز أي طلبات قياس سرعة أو فحص استجابة (Ping / Speedtest / POST)
  if (req.method !== 'GET' || BYPASS_URL_PATTERNS.some(pat => url.includes(pat))) {
    event.respondWith(fetch(req));
    return;
  }

  // 2. إستراتيجية Network First مع Fallback إلى Cache للملفات الأساسية
  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        // تحديث الكاش بنسخة طازجة إذا كان الطلب ناجحاً
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // عند انقطاع الإنترنت، جلب النسخة المحفوظة من الكاش
        const cachedResponse = await caches.match(req);
        if (cachedResponse) {
          return cachedResponse;
        }

        // إذا كان الطلب تنقل بين الصفحات، إرجاع index.html أوفلاين
        if (req.mode === 'navigate') {
          return caches.match('./index.html');
        }

        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});

