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
  //open btshof lw mwgod btrg3o ka promise lw msh mwgod bt3mlo create w trg3o brdo.
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
  //lw 3ayz 23ml dynamic cache l url mo3yn 2kon mzbt cache w fetch bt3to fl js files badal el sw w hena bs 2zbt dynamic cache leh.
  // if (e.request.url.indexOf(urlWanted) > -1) {
  //   e.respondWith(
  //     caches.open(currentDynamicCacheName).then((dynamicCache) => {
  //       return fetch(e.request).then((networkRes) => {
  //         dynamicCache.put(e.request.url, networkRes.clone());
  //         return networkRes;
  //       });
  //     })
  //   );
  // }

  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      //lw e.request msh mwgod fl cach hykon el response null
      return (
        cacheRes ||
        fetch(e.request)
          .then((networkRes) => {
            //put in dynamic cache then return the networkresponse
            return caches.open(currentDynamicCacheName).then((dynamicCache) => {
              //3mlna clone 3shan el response can be consumed only one time w momkn 23ks 25le el return hwa ele cloned
              //lw 3ayz 25f el dynaamicCache shwia 2bl mzwd 3leh trimCache(currentDynamicCacheName, 4)
              dynamicCache.put(e.request.url, networkRes.clone());
              return networkRes;
            });
          })
          .catch((err) => {
            //hena feh moshkla lsa m7lnhash en hena bn2ol lw el fetch baz yb3t fallback page 3ala 2sas eno lw d5l el page deh offline w hwa msh 3mlha cashe , bs moomkn el fetch yboz lw online brdo lw bgeb json data mn ay 7eta msln 2w 2y 7aga 7slt bshkl 3am fl server 2w el network. fana kda ahb3tlo el fallback page brdo fe 2y wa2t wana 3yzha tkon bs lw hwa offline w m3mlsh ll page cashe.
            return caches.open(currentStaticCacheName).then((staticCache) => {
              //lw 3ayz 2a2olo eb3t l fallbackpage ll sf7 el html bs msh msln request css 2w image 2w kda 23ml kda=>if (e.request.headers.get('accept').includes('text/html'))
              return staticCache.match('/pwa%20test/offlineFallback.html');
            });
          })
      );
    })
  );
});

//lw 3ayz 2shel shwia mn el cache lw b2aa kbeer 2wi 5astn el dynamic msln.
function trimCache(cacheName, maxLimit) {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keysArray) => {
      if (keysArray.length > maxLimit) {
        cache.delete(keysArray[0]).then(trimCache(cacheName, maxLimit));
      }
    });
  });
}
