const BASE_PATH = self.location.pathname.replace(/sw\.js$/, '') || '/'
const NORMALIZED_BASE_PATH = BASE_PATH.endsWith('/') ? BASE_PATH : `${BASE_PATH}/`
const CACHE_NAME = `rocket-alpha-shell-${NORMALIZED_BASE_PATH}`
const APP_SHELL = [
  NORMALIZED_BASE_PATH,
  `${NORMALIZED_BASE_PATH}manifest.webmanifest`,
  `${NORMALIZED_BASE_PATH}favicon.svg`,
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestUrl = new URL(event.request.url)
  if (requestUrl.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const responseClone = networkResponse.clone()
        void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
        return networkResponse
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse
          return caches.match(NORMALIZED_BASE_PATH)
        }),
      ),
  )
})
