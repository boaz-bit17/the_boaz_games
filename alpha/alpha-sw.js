// The alpha has its own empty service worker. It is closer than the site's one, so the site's
// worker leaves these pages alone: nothing of the alpha is kept or mixed into the main game's offline copy.
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
