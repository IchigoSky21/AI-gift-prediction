// Nama cache diperbarui agar pengguna versi lama mendapat update
const CACHE_NAME = 'gifto-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Hanya proses metode GET
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Pastikan request mengarah ke domain sendiri (sama origin)
  if (url.origin !== self.location.origin) return;

  // BYPASS CACHE: Jangan cache apapun yang mengarah ke backend (/api/)
  if (url.pathname.startsWith('/api/')) {
      return; 
  }

  // Strategi Stale-While-Revalidate untuk aset statis (HTML, PNG, dll)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
