const CACHE="sola-v9";
const ASSETS=["./","./index.html","./manifest.json"];

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});

self.addEventListener("push",event=>{
  let data={title:"📚 Moj Organizator",body:"Imaš novo obvestilo.",url:"./"};
  try{
    if(event.data){
      const incoming=event.data.json();
      data={...data,...incoming};
    }
  }catch{
    if(event.data)data.body=event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title,{
      body:data.body,
      tag:data.tag||"solski-organizator",
      renotify:true,
      data:{url:data.url||"./"}
    })
  );
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const target=event.notification.data?.url||"./";
  event.waitUntil(
    clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
      for(const client of list){
        if("focus" in client){
          try{client.navigate(target)}catch{}
          return client.focus();
        }
      }
      return clients.openWindow?clients.openWindow(target):undefined;
    })
  );
});
