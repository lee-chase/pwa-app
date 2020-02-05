/* global workbox */

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

const articleHandler = workbox.strategies.networkFirst({
  cacheName: "articles-cache",
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 50
    })
  ]
});

workbox.routing.registerRoute(/http:\/\/localhost:5051\/.*/, args => {
  return articleHandler.handle(args).then(response => {
    // // eslint-disable-next-line
    // console.log("got here");
    if (!response) {
      return caches.match("pages/offline.html");
    } else if (response.status === 404) {
      return caches.match("pages/404.html");
    }
    return response;
  });
});
