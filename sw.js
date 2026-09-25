/* ==========================================================
   Service Worker — FITNESS OS
   Estratégia: network-first com fallback para cache.
   - Sempre tenta buscar a versão mais nova na rede primeiro.
   - Se não houver internet, serve do cache (offline-first real).
   - CACHE_VERSION deve ser incrementado a cada publicação nova
     (ex.: 'fitnessos-v2', 'fitnessos-v3'...). Isso garante que
     o app NUNCA fique preso permanentemente numa versão antiga:
     ao mudar a versão, o cache antigo é apagado no "activate".
   ========================================================== */
const CACHE_VERSION = 'fitnessos-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/css/styles.css',
  '/js/storage.js',
  '/js/platform.js',
  '/js/pwa.js',
  '/js/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // não trava numa versão antiga esperando abas fecharem
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => {
          if (cached) return cached;
          if (req.mode === 'navigate') return caches.match('/index.html');
          return undefined;
        })
      )
  );
});
