const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
var FILES_TO_CACHE = [
    '/',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/styles.css',
    '/index.js',
    '/manifest.json',
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
    "/db.js"
];

// Installing the things from the cache.  Helpful for when it comes back online.

self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });

// For storing api data from the /api webpages.
  
self.addEventListener("fetch", function(evt) {
    // cache successful requests to the API
    if (evt.request.url.includes("/api")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then((response) => {
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
            .catch((err) => {
              return cache.match(evt.request);
            });
        }).catch((err) => console.log(err))
      );
  
      return;
    }
  
    // If the offline fetch was successful, then store the data, if not it will ignore it.

    evt.respondWith(
        fetch(evt.request).catch(function(){
            return caches.match(evt.request).then(function(response){
                if(response) {
                    return response;
                } else if (evt.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            });
        })
    );
  });