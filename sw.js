// ========== SERVICE WORKER - Auto Partes Rey ==========
var CACHE = 'apr-v1';
var ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/firebase.js',
  '/js/data.js',
  '/js/store.js',
  '/js/ui.js',
  '/js/bot.js',
  '/js/app.js',
  '/img/logo.png',
  '/img/logo-app.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-512x512.png',
  '/ejemplos/backgroun beige.webp'
];

// Instalar: cachear archivos estáticos
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar: limpiar caches viejos
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, cache fallback
self.addEventListener('fetch', function(e) {
  // Solo interceptar GET y mismo origen
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // Guardar copia fresca en cache
        var clone = response.clone();
        caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        return response;
      })
      .catch(function() {
        // Sin red → devolver desde cache
        return caches.match(e.request);
      })
  );
});
