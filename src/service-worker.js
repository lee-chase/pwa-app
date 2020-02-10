/* global workbox, importScripts */
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

workbox.core.setCacheNameDetails({ prefix: "pwa-app" });

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// install new service worker when ok, then reload page.
self.addEventListener("message", msg => {
  if (msg.data.action == "skipWaiting") {
    self.skipWaiting();
  }
});

// When usig precaching the client files are already in the cache and will follow a cacheOnly strategy.
//
// If not using precaching or wanting to cache non-build time generated information you will need to choose a caching strategy.
//
// https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_only
//
const articleHandler = workbox.strategies.networkFirst({
  cacheName: "articles-cache",
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
    })
  ]
});

workbox.routing.registerRoute(/http:\/\/localhost:5051\/article\/.*/, args => {
  // article\/
  return articleHandler.handle(args).then(response => {
    if (!response) {
      return caches.match("pages/offline.html");
    } else if (response.status === 404) {
      return caches.match("pages/404.html");
    }
    return response;
  });
});

const articleDataHandler = workbox.strategies.staleWhileRevalidate({
  cacheName: "articles-data-cache",
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
    }),
    new workbox.broadcastUpdate.Plugin("wbu-channel")
  ]
});

workbox.routing.registerRoute(/http:\/\/localhost:5051\/_data\/.*/, args => {
  return articleDataHandler.handle(args).then(response => {
    if (!response) {
      return caches.match("pages/offline.html");
    } else if (response.status === 404) {
      return caches.match("pages/404.html");
    }
    return response;
  });
});
