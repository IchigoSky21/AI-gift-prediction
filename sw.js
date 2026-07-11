const CACHE_NAME = 'gifto-v1';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.url.includes('/api/')) return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(caches.match(e.request).then(cached => { const net = fetch(e.request).then(r => { caches.open(CACHE_NAME).then(c => c.put(e.request, r.clone())); return r; }).catch(() => cached); return cached || net; }));
});
