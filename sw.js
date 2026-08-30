const CACHE='sola-v6';
const ASSETS=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))});
self.addEventListener('push',event=>{
 let data={title:'📚 Čas je za učenje',body:'Odpri Moj organizator in preveri današnji plan.',url:'./'};
 try{if(event.data)data={...data,...event.data.json()}}catch(e){}
 event.waitUntil(self.registration.showNotification(data.title,{body:data.body,tag:data.tag||'study-reminder',data:{url:data.url||'./'}}));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const url=event.notification.data?.url||'./';
 event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
  for(const c of list){if('focus'in c){c.navigate(url);return c.focus()}}
  if(clients.openWindow)return clients.openWindow(url);
 }));
});
