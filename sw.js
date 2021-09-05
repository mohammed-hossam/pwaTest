console.log('welcome from sw');
let cachName = 'pwaTest1';
//lazm nktb / w index.html 3shan fl server el etnan msh wa7d
let assets = [
  '/',
  '/pwa%20test/index.html',
  '/pwa%20test/app.js',
  '/pwa%20test/style.css',
];

//install
self.addEventListener('install', (e) => {
  //console.log('sw installed', e);
  e.waitUntil(
    caches
      .open(cachName)
      .then((cache) => {
        cache.addAll(assets).catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      })
  );
});

//activate
self.addEventListener('activate', (e) => {
  //console.log('sw activated', e);
});

//fetch
self.addEventListener('fetch', (e) => {
  console.log('fetch', e);
  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      //lw e.request msh mwgod fl cach hykon el response null
      return (
        cacheRes ||
        fetch(e.request).then((networkRes) => {
          return caches.open('dynamic').then((dynamicCacheRes) => {
            dynamicCacheRes.put(e.request.url, networkRes.clone());
            return networkRes;
          });
        })
      );
    })
  );
});
