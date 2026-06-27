const CACHE_NAME = 'jw-cuaderno-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://img.icons8.com/fluency/192/book.png',
  'https://img.icons8.com/fluency/512/book.png'
];

// Instalar y guardar recursos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Estrategia: Cache First (Priorizar caché para la interfaz estática)
self.addEventListener('fetch', e => {
  // Ignorar peticiones externas de Apps Script para que no se claven en caché
  if (e.request.url.includes('script.google.com')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
