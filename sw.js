const CACHE_NAME = "fsmobile-v345";
const APP_VERSION = "2026-09-06-v345";
const CACHE_PREFIX = "fsmobile-v";
const CACHE_BUDGET_MIB = 45;
const MAX_CACHE_BYTES = CACHE_BUDGET_MIB * 1024 * 1024;
const RUNTIME_ENTRY_BUDGET_MIB = 4;
const MAX_RUNTIME_ENTRY_BYTES = RUNTIME_ENTRY_BUDGET_MIB * 1024 * 1024;
const MAX_RUNTIME_ENTRIES = 24;
const NETWORK_TIMEOUT_MS = 3000;
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./image-storage.js",
  "./app.js",
  "./ui-consistency.js",
  "./ui-consistency.css",
  "./modules.js",
  "./module-manifest.js",
  "./maengelliste.js",
  "./maengelliste-bilddoku.js",
  "./aufmass-akku.js",
  "./aufmass-einsteckschloss.js",
  "./aufmass-tueren.js",
  "./pb-rwa.js",
  "./pb-not-sicherheitsbeleuchtung.js",
  "./pb-brandschutzklappen.js",
  "./pb-brandschutzschiebetor.js",
  "./pb-brandschutzrolltore.js",
  "./pb-rolltoranlagen.js",
  "./pb-schiebetuerantrieb.js",
  "./pb-drehfluegelantrieb.js",
  "./pb-rauchschutzvorhaenge.js",
  "./pb-feststellanlagen.js",
  "./pb-fluchttuer-steuerungen.js",
  "./pb-druckerhoehungsanlage.js",
  "./pb-loeschwasser-trocken.js",
  "./pb-wandhydranten.js",
  "./anleitung-rwa-pyro.js",
  "./anleitung-rwa-elektrisch.js",
  "./anleitung-rwa-co2.js",
  "./anleitung-fsa-1-flg.js",
  "./anleitung-fsa-2-flg.js",
  "./anleitung-dfa-1-flg.js",
  "./anleitung-dfa-2-flg.js",
  "./anleitung-bst-1-flg.js",
  "./anleitung-bst-2-flg.js",
  "./anleitung-zba.js",
  "./anleitung-sibel-ezb.js",
  "./anleitung-schiebetor.js",
  "./anleitung-fluchttuer-steuerung.js",
  "./anleitung-rolltore.js",
  "./anleitung-bsk.js",
  "./anleitung-bs-vorhang.js",
  "./pb-rauchwarnmelder.js",
  "./auftrag-bescheinigungen.js",
  "./druckpruefung-din-14462.js",
  "./planungshilfe-bma.js",
  "./pb-feuerloescher.js",
  "./pb-brandschutztueren.js",
  "./maengel-bt-fsa.js",
  "./maengel-bsk.js",
  "./maengel-automatiktueren.js",
  "./maengel-not-sicherheitsleuchte.js",
  "./maengel-rauchwarnmelder.js",
  "./maengelliste-maengelbeschreibungen.js",
  "./aufmass-brandabschottungen.js",
  "./pb-zentralbatterie-anlage.js",
  "./pb-loeschwasser-nass.js",
  "./pb-nass-trocken-station.js",
  "./pb-hydranten.js",
  "./manifest.webmanifest",
  "./vendor/html2canvas.min.js",
  "./vendor/jspdf.umd.min.js",
  "./assets/fsmobile-menu-bg.png",
  "./assets/fsmobile-menu-bg.webp",
  "./icons/apple-touch-icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png"
]

const SCOPE_URL = self.registration.scope;
const CORE_URLS = new Set(CORE_ASSETS.map(asset => normalizedUrl(new URL(asset, SCOPE_URL))));

self.addEventListener("message", event => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (data.type === "GET_CACHE_STATUS") {
    event.waitUntil(replyWithCacheStatus(event));
  }
});

function normalizedUrl(value) {
  const url = value instanceof URL ? new URL(value.href) : new URL(String(value), SCOPE_URL);
  url.search = "";
  url.hash = "";
  return url.href;
}

function normalizedRequest(request) {
  return new Request(normalizedUrl(request.url));
}

function reloadRequest(request, signal) {
  return new Request(request, { cache: "reload", ...(signal ? { signal } : {}) });
}

function shouldReloadFromNetwork(url) {
  return /\.(?:html|js|css|webmanifest)$/i.test(url.pathname) || url.pathname.endsWith("/");
}

function isCoreRequest(request) {
  const value = typeof request === "string" ? request : request.url;
  return CORE_URLS.has(normalizedUrl(value));
}

function isCacheableResponse(response) {
  return Boolean(response && response.status === 200 && response.type === "basic");
}

async function fetchWithTimeout(request, timeoutMs = NETWORK_TIMEOUT_MS) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  let timeoutId = 0;
  try {
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        if (controller) controller.abort();
        reject(new Error("network-timeout"));
      }, timeoutMs);
    });
    const networkRequest = controller ? new Request(request, { signal: controller.signal }) : request;
    return await Promise.race([fetch(networkRequest), timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function matchCachedRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  return await cache.match(normalizedRequest(request)) ||
    await cache.match(request, { ignoreSearch: true }) ||
    null;
}

async function matchCachedShell() {
  const cache = await caches.open(CACHE_NAME);
  return await cache.match(new Request(new URL("./index.html", SCOPE_URL))) ||
    await cache.match(new Request(new URL("./", SCOPE_URL))) ||
    null;
}

async function responseByteSize(response) {
  if (!response) return 0;
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength >= 0) return contentLength;
  return (await response.clone().blob()).size;
}

async function cacheStatus(cache = null) {
  const activeCache = cache || await caches.open(CACHE_NAME);
  const requests = await activeCache.keys();
  let totalBytes = 0;
  let runtimeEntryCount = 0;
  for (const request of requests) {
    const response = await activeCache.match(request);
    totalBytes += await responseByteSize(response);
    if (!isCoreRequest(request)) runtimeEntryCount += 1;
  }

  const missingCoreAssets = [];
  for (const asset of CORE_ASSETS) {
    const request = new Request(new URL(asset, SCOPE_URL));
    if (!await activeCache.match(request, { ignoreSearch: true })) missingCoreAssets.push(asset);
  }

  const withinBudget = totalBytes <= MAX_CACHE_BYTES;
  return {
    cacheName: CACHE_NAME,
    appVersion: APP_VERSION,
    totalBytes,
    maxCacheBytes: MAX_CACHE_BYTES,
    cacheBudgetMib: CACHE_BUDGET_MIB,
    maxRuntimeEntryBytes: MAX_RUNTIME_ENTRY_BYTES,
    maxRuntimeEntries: MAX_RUNTIME_ENTRIES,
    entryCount: requests.length,
    runtimeEntryCount,
    coreAssetCount: CORE_ASSETS.length,
    cachedCoreAssetCount: CORE_ASSETS.length - missingCoreAssets.length,
    missingCoreAssets,
    withinBudget,
    offlineReady: withinBudget && missingCoreAssets.length === 0
  };
}

async function trimRuntimeCache(cache) {
  const requests = await cache.keys();
  const entries = [];
  let totalBytes = 0;
  for (const request of requests) {
    const response = await cache.match(request);
    const size = await responseByteSize(response);
    totalBytes += size;
    entries.push({ request, size, core: isCoreRequest(request) });
  }

  const runtimeEntries = entries.filter(entry => !entry.core);
  while (runtimeEntries.length > MAX_RUNTIME_ENTRIES || totalBytes > MAX_CACHE_BYTES) {
    const oldest = runtimeEntries.shift();
    if (!oldest) break;
    if (await cache.delete(oldest.request)) totalBytes -= oldest.size;
  }
}

async function storeRuntimeResponse(request, response) {
  if (!isCacheableResponse(response)) return;
  const normalized = normalizedRequest(request);
  const core = isCoreRequest(normalized);
  const responseSize = await responseByteSize(response);
  if (!core && responseSize > MAX_RUNTIME_ENTRY_BYTES) return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(normalized, response);
  if (!core) await trimRuntimeCache(cache);
}

async function storeNavigationResponse(response) {
  if (!isCacheableResponse(response)) return;
  const cache = await caches.open(CACHE_NAME);
  await Promise.all([
    cache.put(new Request(new URL("./", SCOPE_URL)), response.clone()),
    cache.put(new Request(new URL("./index.html", SCOPE_URL)), response)
  ]);
}

async function replyWithCacheStatus(event) {
  const port = event.ports && event.ports[0];
  if (!port) return;
  try {
    port.postMessage({ type: "CACHE_STATUS", status: await cacheStatus() });
  } catch (error) {
    port.postMessage({ type: "CACHE_STATUS", error: error && error.message ? error.message : String(error) });
  }
}

async function installCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(CORE_ASSETS.map(asset => new Request(asset, { cache: "reload" })));
  await trimRuntimeCache(cache);
  const status = await cacheStatus(cache);
  if (!status.offlineReady) {
    throw new Error(`FSMobile core cache is incomplete or exceeds ${CACHE_BUDGET_MIB} MiB.`);
  }
}

async function activateCurrentCache() {
  const keys = await caches.keys();
  await Promise.all(keys
    .filter(key => key !== CACHE_NAME && key.startsWith(CACHE_PREFIX))
    .map(key => caches.delete(key)));
  const cache = await caches.open(CACHE_NAME);
  await trimRuntimeCache(cache);
  await self.clients.claim();
}

function offlineAssetResponse() {
  return new Response("Offline: Ressource nicht verfuegbar.", {
    status: 504,
    statusText: "Offline",
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

self.addEventListener("install", event => {
  event.waitUntil(installCoreAssets());
});

self.addEventListener("activate", event => {
  event.waitUntil(activateCurrentCache());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cachedShell = await matchCachedShell();
      if (cachedShell) return cachedShell;
      try {
        const response = await fetchWithTimeout(reloadRequest(request));
        if (isCacheableResponse(response)) await storeNavigationResponse(response.clone());
        return response;
      } catch (error) {
        return offlineAssetResponse();
      }
    })());
    return;
  }

  if (isCoreRequest(request)) {
    event.respondWith((async () => {
      const cached = await matchCachedRequest(request);
      if (cached) return cached;
      try {
        const response = await fetchWithTimeout(reloadRequest(request));
        if (isCacheableResponse(response)) await storeRuntimeResponse(normalizedRequest(request), response.clone());
        return response;
      } catch (error) {
        return offlineAssetResponse();
      }
    })());
    return;
  }

  const networkRequest = shouldReloadFromNetwork(url) ? reloadRequest(request) : request;
  const cacheRequest = normalizedRequest(request);
  const networkResult = fetchWithTimeout(networkRequest).then(response => ({
    response,
    cacheResponse: isCacheableResponse(response) ? response.clone() : null
  }));

  event.respondWith(
    networkResult
      .then(result => result.response)
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return await cache.match(cacheRequest) ||
          await cache.match(request, { ignoreSearch: true }) ||
          offlineAssetResponse();
      })
  );
  event.waitUntil(
    networkResult
      .then(result => result.cacheResponse ? storeRuntimeResponse(cacheRequest, result.cacheResponse) : undefined)
      .catch(() => undefined)
  );
});
