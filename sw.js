/* SmartLekka offline cache. The app shell is cached so the app opens without internet.
   The tutorial video is left to the browser (it streams it in parts), so it is not cached here. */
var CACHE='smartlekka-v1';
var SHELL=['./','./index.html','./manifest.webmanifest','./icons/favicon-32.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon-180.png','./video/tutorial-poster.jpg'];
self.addEventListener('install',function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(n){ return n!==CACHE; }).map(function(n){ return caches.delete(n); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET') return;
  var u=new URL(r.url); if(u.origin!==location.origin || /\.mp4$/i.test(u.pathname)) return;
  if(r.mode==='navigate'){ e.respondWith(fetch(r).then(function(res){ var c=res.clone(); caches.open(CACHE).then(function(x){ x.put('./index.html',c); }); return res; }).catch(function(){ return caches.match('./index.html'); })); return; }
  e.respondWith(caches.match(r).then(function(m){ return m || fetch(r).then(function(res){ if(res.ok){ var c=res.clone(); caches.open(CACHE).then(function(x){ x.put(r,c); }); } return res; }); }));
});
