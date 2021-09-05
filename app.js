console.log('welcome from app');
if (window.navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js').then((e) => {
    console.log('sw registered', e);
  });
}
console.log('welcome from app2');
