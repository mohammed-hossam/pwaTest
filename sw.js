console.log('welcome from sw');
let currentStaticCacheName = 'pwaTest-static-v2';
let currentDynamicCacheName = 'pwaTest-dynamic-v1';

//lazm nktb / w index.html 3shan fl server el etnan msh wa7d
let assets = [
  '/',
  '/pwa%20test/index.html',
  '/pwa%20test/offlineFallback.html',
  '/pwa%20test/app.js',
  '/pwa%20test/style.css',
];

//install
self.addEventListener('install', (e) => {
  //console.log('sw installed', e);
  e.waitUntil(
    caches
      .open(currentStaticCacheName)
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
  // The keys() method of the Cache interface returns a Promise that resolves to an array of Cache keys.

  //handelling cache versioning
  e.waitUntil(
    caches.keys().then((keysArray) => {
      return Promise.all(
        keysArray.map((key) => {
          if (
            key !== currentStaticCacheName &&
            key !== currentDynamicCacheName
          ) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

//dynamic cashe: ene 23ml cache l 2y 7aga el 7aga el user 3mlha fetch w heya msh mwgoda fl precache.

//fetch
self.addEventListener('fetch', (e) => {
  console.log('fetch', e);
  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      //lw e.request msh mwgod fl cach hykon el response null
      return (
        cacheRes ||
        fetch(e.request)
          .then((networkRes) => {
            return caches.open(currentDynamicCacheName).then((dynamicCache) => {
              //3mlna clone 3shan el response can be consumed only one time w momkn 23ks 25le el return hwa ele cloned
              dynamicCache.put(e.request.url, networkRes.clone());
              return networkRes;
            });
          })
          .catch((err) => {
            //hena feh moshkla lsa m7lnhash en hena bn2ol lw el fetch baz yb3t fallback page 3ala 2sas eno lw d5l el page deh offline w hwa msh 3mlha cashe , bs moomkn el fetch yboz lw online brdo lw bgeb json data mn ay 7eta msln 2w 2y 7aga 7slt bshkl 3am fl server 2w el network. fana kda ahb3tlo el fallback page brdo fe 2y wa2t wana 3yzha tkon bs lw hwa offline w m3mlsh ll page cashe.
            return caches.open(currentStaticCacheName).then((staticCache) => {
              return staticCache.match('/pwa%20test/offlineFallback.html');
            });
          })
      );
    })
  );
});
