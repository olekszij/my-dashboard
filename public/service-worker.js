const CACHE_NAME = 'music-player-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/music.jpg',
];

// Helper function to check if a request should be cached
function shouldCacheRequest(request) {
  try {
    const url = new URL(request.url);
    // Ignore all non-http(s) requests
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }
    // Only cache GET requests
    if (request.method !== 'GET') {
      return false;
    }
    return true;
  } catch {
    // If URL parsing fails, don't cache
    return false;
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${url}: ${response.status}`);
                }
                return cache.put(url, response);
              })
              .catch(error => {
                console.error(`Failed to cache ${url}:`, error);
                return Promise.resolve();
              });
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip unsupported requests
  if (!shouldCacheRequest(event.request)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a success response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('Failed to cache response:', error);
              });
            return response;
          });
      })
  );
}); 