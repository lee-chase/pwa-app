console.dir(workbox);

// workbox.core.setCacheNameDetails({ prefix: "pwa-app" });

// workbox.core.skipWaiting();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// install new service worker when ok, then reload page.
self.addEventListener("message", msg => {
  console.log("Got a message");
  console.dir(msg);
  if (msg.data.action == "skipWaiting") {
    self.skipWaiting();
  }
});
