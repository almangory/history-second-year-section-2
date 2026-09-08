/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Progressive Web App (PWA) Offline-First Service Worker
 * منصة تاريخ السودان والتربية الوطنية - الصف السادس الابتدائي
 */

const CACHE_VERSION = "sudan-grade6-history-v7";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const TILES_CACHE = `${CACHE_VERSION}-tiles`;

// Core App Shell assets precached on install
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.png",
  "/logo.png",
  "/naqla-logo.png",
  "/sudan-bot.png",
  "/sudan-bot-avatar.png",
  "/apple-touch-icon.png",
  "/icon.svg"
];

// Helper to limit cache size (e.g. for map tiles)
const limitCacheSize = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    limitCacheSize(cacheName, maxItems);
  }
};

// 1. INSTALL: Precache App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[PWA ServiceWorker] Precaching App Shell for offline use...");
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[PWA ServiceWorker] Precache partial error (ignored for non-critical assets):", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE: Clean up old cache versions and claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!key.startsWith(CACHE_VERSION)) {
            console.log("[PWA ServiceWorker] Purging outdated cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH: Smart Offline-First Strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Video and Audio Media Streams (HTTP Range / 206 Partial Content)
  // Let browser handle media streaming natively for smooth seeking & scrubbing
  if (url.pathname.match(/\.(mp4|webm|ogg|mp3|wav)$/i) || request.headers.get("range")) {
    return;
  }

  // Strategy A: Cloud AI Mentor & Backend APIs -> Network Only with graceful offline JSON fallback
  if (url.pathname.startsWith("/api/") || url.hostname.includes("local-ai-arsenal.pages.dev")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            message: "أنت الآن في وضع عدم الاتصال بالإنترنت. كامل دروس المنهج والاختبارات وأوراق العمل تعمل بكامل كفاءتها بدون إنترنت."
          }),
          {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            status: 200
          }
        );
      })
    );
    return;
  }

  // Strategy B: Navigation Requests (HTML pages: / or /index.html)
  // Network-First with quick timeout falling back to cached /index.html
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          // Try network with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          const networkResponse = await fetch(request, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            cache.put("/index.html", networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // Offline fallback
          console.log("[PWA ServiceWorker] Serving cached HTML shell offline:", request.url);
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          const shellResponse = await caches.match("/index.html");
          if (shellResponse) return shellResponse;

          return await caches.match("/");
        }
      })()
    );
    return;
  }

  // Strategy C: Map Tiles (OpenStreetMap, Esri Imagery, Topo)
  // Cache-First with Network Fallback & Graceful Blank Tile
  if (
    url.hostname.includes("tile.openstreetmap") ||
    url.hostname.includes("arcgisonline.com")
  ) {
    event.respondWith(
      (async () => {
        const cachedTile = await caches.match(request);
        if (cachedTile) {
          return cachedTile;
        }

        try {
          const networkTile = await fetch(request);
          if (networkTile && networkTile.status === 200) {
            const cache = await caches.open(TILES_CACHE);
            cache.put(request, networkTile.clone());
            limitCacheSize(TILES_CACHE, 250);
          }
          return networkTile;
        } catch (err) {
          // Return transparent 1x1 GIF so Leaflet doesn't throw broken image icons
          return new Response(
            Uint8Array.from([
              0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00,
              0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00,
              0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02,
              0x44, 0x01, 0x00, 0x3b
            ]),
            { headers: { "Content-Type": "image/gif" } }
          );
        }
      })()
    );
    return;
  }

  // Strategy D: Static Assets (JS, CSS, Images, Icons, Google Fonts)
  // Stale-While-Revalidate: serve immediately from cache, update in background
  const isStaticAsset =
    url.pathname.startsWith("/assets/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|ico|woff2?|ttf|eot)$/i) ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com");

  if (isStaticAsset) {
    event.respondWith(
      (async () => {
        const cachedAsset = await caches.match(request);

        const fetchPromise = fetch(request)
          .then(async (networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cache = await caches.open(DYNAMIC_CACHE);
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            // Offline - fetch failed
            return null;
          });

        // Return cached version immediately if found, else wait for network
        if (cachedAsset) {
          // Trigger background update without blocking response
          event.waitUntil(fetchPromise);
          return cachedAsset;
        }

        const networkRes = await fetchPromise;
        if (networkRes) return networkRes;

        // If both cache and network fail, try any cached asset or return 404
        return new Response("Resource unavailable offline", { status: 404 });
      })()
    );
    return;
  }

  // Strategy E: Generic fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const cloned = networkRes.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, cloned));
          }
          return networkRes;
        }).catch(() => caches.match("/index.html"))
      );
    })
  );
});
