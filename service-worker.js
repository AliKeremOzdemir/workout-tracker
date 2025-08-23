const CACHE='tracker-cache-v12';
const ASSETS=['./','./index.html','./manifest.json','./service-worker.js','./icon-192.png','./icon-512.png','./offline.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{ if(e.data&&e.data.type==='SKIP_WAITING'){ self.skipWaiting(); } });
self.addEventListener('fetch',e=>{const req=e.request; const accept=req.headers.get('accept')||''; if(accept.includes('text/html')){ e.respondWith(fetch(req).then(res=>{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res; }).catch(()=> caches.match(req).then(r=> r|| caches.match('./offline.html')))); } else { e.respondWith(caches.match(req).then(r=> r || fetch(req).then(res=>{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res; }).catch(()=> caches.match('./offline.html')))); } });
