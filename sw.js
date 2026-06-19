const CACHE_NAME = "fsmobile-v229";
const APP_VERSION = "2026-06-19-v229";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./modules.js",
  "./manifest.webmanifest",
  "./vendor/html2canvas.min.js",
  "./vendor/jspdf.umd.min.js",
  "./assets/fsmobile-menu-bg.png",
  "./assets/fsmobile-menu-bg.webp",
  "./icons/apple-touch-icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png"
];

self.addEventListener("message", event => {
  const data = event.data || {};
  if (data && data.type === "SKIP_WAITING") self.skipWaiting();
});

function normalizedRequest(request) {
  const url = new URL(request.url);
  return new Request(url.origin + url.pathname);
}

function reloadRequest(request) {
  return new Request(request, { cache: "reload" });
}

function shouldReloadFromNetwork(url) {
  return /\.(?:html|js|css|webmanifest)$/i.test(url.pathname) || url.pathname.endsWith("/");
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS.map(asset => new Request(asset, { cache: "reload" }))))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(reloadRequest(request))
        .then(response => {
          if (response && response.status === 200 && response.type === "basic") {
            caches.open(CACHE_NAME).then(cache => {
              cache.put("./index.html", response.clone());
              cache.put("./", response.clone());
            });
          }
          return response;
        })
        .catch(() => caches.match("./index.html").then(cached => cached || caches.match("./")))
    );
    return;
  }

  const networkRequest = shouldReloadFromNetwork(url) ? reloadRequest(request) : request;
  const cacheRequest = normalizedRequest(request);

  event.respondWith(
    fetch(networkRequest)
      .then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(cacheRequest, copy));
        }
        return response;
      })
      .catch(() => caches.match(cacheRequest).then(cached => cached || caches.match(request, { ignoreSearch: true }) || caches.match("./index.html")))
  );
});
