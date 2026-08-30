const CACHE='sola-v8-5-1';const ASSETS=['./','./index.html','./manifest.json'];self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const q=r.clone();caches.open(CACHE).then(c=>c.put(e.request,q));return r}).catch(()=>caches.match(e.request)))});self.addEventListener('push',e=>{let d={title:'📚 Čas je za učenje',body:'Preveri današnji učni plan.',url:'./'};try{if(e.data)d={...d,...e.data.json()}}catch{}e.waitUntil(self.registration.showNotification(d.title,{body:d.body,tag:d.tag||'study-reminder',data:{url:d.url||'./'}}))});self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow(e.notification.data?.url||'./'))});
self.addEventListener("push",event=>{
 let data={};
 try{data=event.data?event.data.json():{}}catch{data={body:event.data?event.data.text():""}}
 const title=data.title||"Moj Organizator";
 const options={
  body:data.body||"Čas je za učenje.",
  icon:"./icon-192.png",
  badge:"./icon-192.png",
  data:{url:data.url||"./"}
 };
 event.waitUntil(self.registration.showNotification(title,options));
});
