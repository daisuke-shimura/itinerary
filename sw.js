const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/itinerary/',
  '/itinerary/index.html',
  
  '/itinerary/assets/css/style.css',
  '/itinerary/assets/js/script.js',
  
  '/itinerary/assets/img/favicon.ico',
  '/itinerary/assets/img/favicon.png',
  '/itinerary/assets/img/icon-192x192.png',
  '/itinerary/assets/img/icon-512x512.png',
  '/itinerary/assets/img/ogp.jpg',
  
  '/itinerary/assets/img/confirmation/canyonig.webp',
  '/itinerary/assets/img/confirmation/car.webp',
  '/itinerary/assets/img/confirmation/villa.webp',
  
  '/itinerary/assets/img/cover/back.webp',
  '/itinerary/assets/img/cover/content.webp',
  '/itinerary/assets/img/cover/front.webp',
  '/itinerary/assets/img/cover/handwritten.webp',
  
  '/itinerary/assets/img/spot/atami_beach.webp',
  '/itinerary/assets/img/spot/atami_drive.webp',
  '/itinerary/assets/img/spot/oomuro.webp',
  '/itinerary/assets/img/spot/shirogasaki.webp',
  '/itinerary/assets/img/spot/sprash.webp',
  '/itinerary/assets/img/spot/waystation_ice.webp',
  '/itinerary/assets/img/spot/zoo.webp',
  
  '/itinerary/assets/img/villa/floor.webp',
  '/itinerary/assets/img/villa/outside.webp',
  '/itinerary/assets/img/villa/publicity.webp',
  '/itinerary/assets/img/villa/wi-fi.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
