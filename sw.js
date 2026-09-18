/* Service worker: cache offline do Ateliê Estelar */
const CACHE = 'atelie-estelar-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg', './css/style.css',
  './js/data.js', './js/art-char.js', './js/art-scene.js', './js/store.js', './js/gacha.js',
  './js/ui-common.js', './js/ui-gacha.js', './js/ui-studio.js', './js/ui-scene.js', './js/ui-events.js', './js/ui-album.js', './js/app.js',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Rede primeiro (para receber atualizações), cache como fallback offline
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
