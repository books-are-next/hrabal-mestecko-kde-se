/* eslint-disable no-restricted-globals */

/* global self, caches, fetch */

const CACHE = 'cache-afdd842';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./mestecko_kde_se_zastavil_cas_002.html","./mestecko_kde_se_zastavil_cas_005.html","./mestecko_kde_se_zastavil_cas_006.html","./mestecko_kde_se_zastavil_cas_007.html","./mestecko_kde_se_zastavil_cas_008.html","./mestecko_kde_se_zastavil_cas_009.html","./mestecko_kde_se_zastavil_cas_010.html","./mestecko_kde_se_zastavil_cas_011.html","./mestecko_kde_se_zastavil_cas_012.html","./mestecko_kde_se_zastavil_cas_013.html","./mestecko_kde_se_zastavil_cas_014.html","./mestecko_kde_se_zastavil_cas_015.html","./mestecko_kde_se_zastavil_cas_016.html","./mestecko_kde_se_zastavil_cas_018.html","./fonts/Literata-Italic-var.woff2","./fonts/Literata-var.woff2","./fonts/LiterataTT-TextItalic.woff2","./fonts/LiterataTT-TextRegular.woff2","./fonts/LiterataTT-TextSemibold.woff2","./fonts/LiterataTT_LICENSE.txt","./fonts/SpaceGroteskVF.woff2","./fonts/SpaceGroteskVF_LICENSE.txt","./resources/image001_fmt.png","./resources/image002_fmt.png","./resources/kocka_fmt.png","./resources/obalka_mestecko_kde_se__fmt.png","./resources/upoutavka_eknihy_fmt.png","./scripts/bundle.js","./style/style.min.css","./template-images/circles.png"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});