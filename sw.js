// Service Worker básico para habilitar la instalación PWA
const CACHE_NAME = 'fatlin-v4-cache-v1'; // Incrementa el número de versión para forzar limpieza

// Archivos a cachear (opcional, para funcionamiento básico offline)
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  // Fuerza al Service Worker a tomar el control inmediatamente
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Lógica para limpiar la caché antigua del dispositivo
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            // Elimina cachés que no coincidan con la versión actual
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Reclama el control de los clientes inmediatamente
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Estrategia: Red primero (Network First)
  // Intentamos obtener el recurso de la red para asegurar que la IA funcione.
  // Si falla (offline), intentamos servir desde la caché.
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});