/* Site Inspection v3.0 Service Worker (Network-First for core files) */
const CACHE_NAME = 'site-inspection-v3.5.2-20261124';
const CORE_FILES = ['./', './index.html', './styles.css', './estates-data.js', './app.js', './manifest.webmanifest'];
const ASSET_PATHS = [
  ...CORE_FILES,
  './icons/favicon.ico', './icons/icon-16.png', './icons/icon-32.png',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
  './vendor/jszip.min.js', './vendor/leaflet/leaflet.js', './vendor/leaflet/leaflet.css',
  './vendor/leaflet/images/marker-icon.png', './vendor/leaflet/images/marker-icon-2x.png',
  './vendor/leaflet/images/marker-shadow.png', './vendor/leaflet/images/layers.png', './vendor/leaflet/images/layers-2x.png'
];

function assetUrls() {
  const base = self.registration.scope;
  return ASSET_PATHS.map((p) => new URL(p, base).href);
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of assetUrls()) {
      try { await cache.add(url); } catch (err) { console.warn('SW skip', url, err); }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isCore = req.mode === 'navigate' || /\/(index\.html|app\.js|styles\.css|manifest\.webmanifest)?$/.test(url.pathname);
  if (isCore) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(async () => (await caches.match(req)) || caches.match(new URL('./index.html', self.registration.scope).href))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
      }
      return res;
    }))
  );
});
