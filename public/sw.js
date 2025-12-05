console.log("[SW] File loaded");

// Install event
self.addEventListener("install", (event) => {
  self.skipWaiting();
  console.log("[SW] Installed");
});

// Activate event
self.addEventListener("activate", (event) => {
  clients.claim();
  console.log("[SW] Activated");
});

// Fetch event
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    // For POST/PUT/DELETE/etc., do nothing (pass through)
    return;
  }

  // Network-first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses (status 200)
        if (
          !response ||
          response.status !== 200 ||
          response.type === "opaque"
        ) {
          return response;
        }
        // Open cache and put the response clone
        return caches.open("app-cache").then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request)) // fallback to cache
  );
});
