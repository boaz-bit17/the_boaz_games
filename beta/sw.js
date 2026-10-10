// Service worker for the installed app. Network first, always: every update
// to the site reaches players right away (the game's own auto-updater keeps
// working). The cache is only a fallback so the game still opens on a weak
// or missing connection. version.json and the database never come from here.
var CACHE = 'canyon-chase-v1';
var SHELL = ['./', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).catch(function(){}));
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  var req = e.request, url = new URL(req.url);
  if(req.method !== 'GET' || url.origin !== self.location.origin) return;   // database, CDN: straight to the network
  if(/version\.json$/.test(url.pathname)) return;                           // the updater must see the real thing
  e.respondWith(fetch(req).then(function(res){
    if(res.ok){
      var copy = res.clone();
      var key = req.mode === 'navigate' ? './' : req;                        // one copy of the page, whatever ?v=
      caches.open(CACHE).then(function(c){ c.put(key, copy); });
    }
    return res;
  }).catch(function(){
    return caches.match(req.mode === 'navigate' ? './' : req);
  }));
});
