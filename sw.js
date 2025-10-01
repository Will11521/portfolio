// Service Worker for efficient caching
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Install - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => 
      cache.addAll(['/', '/index.html', '/style.css', '/main.js'])
    )
  );
});

// Fetch - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Images: cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => 
        cache.match(request).then(response => 
          response || fetch(request).then(fetchResponse => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          })
        )
      )
    );
    return;
  }
  
  // CSS/JS: stale-while-revalidate
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache => 
        cache.match(request).then(response => {
          const fetchPromise = fetch(request).then(fetchResponse => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
          return response || fetchPromise;
        })
      )
    );
    return;
  }
  
  // Other requests: network first
  event.respondWith(fetch(request));
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(cacheNames.map(name => 
        name.startsWith('static-') || name.startsWith('images-') 
          ? name !== STATIC_CACHE && name !== IMAGE_CACHE 
            ? caches.delete(name) : null 
          : null
      ))
    )
  );
});
