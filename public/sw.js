console.log("[SW] File loaded");

self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("[SW] Installed");
});

self.addEventListener("activate", (event) => {
  clients.claim();
  console.log("[SW] Activated");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("app-cache").then((cache) =>
      fetch(event.request)
        .then((response) => {
          // Clone and cache
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cache.match(event.request))
    )
  );
});
