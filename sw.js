/* Service worker: cache offline do Ateliê Estelar */
const CACHE = 'atelie-estelar-v37';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg', './css/style.css',
  './js/core/core.js', './js/core/store.js',
  './js/rig/parts-hair.js', './js/rig/parts-face.js', './js/rig/parts-body.js', './js/rig/parts-acc.js', './js/rig/parts-pets.js', './js/rig/parts-objects.js', './js/rig/rig.js',
  './js/data/poses.js', './js/data/defaults.js', './js/data/backgrounds.js',
  './js/ui/colorpicker.js', './js/ui/modals.js', './js/ui/menu.js', './js/ui/editor.js', './js/ui/editor-panels.js', './js/ui/studio.js', './js/app.js',
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
