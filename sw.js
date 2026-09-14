const CACHE="moj-organizator-v15-0-final";
const CORE=[
  "./","./index.html","./manifest.json","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon-180.png"
];
const ANALYSIS_VENDOR=[
  "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.min.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/worker.min.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0/tesseract-core.wasm.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0/tesseract-core-simd.wasm.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0/tesseract-core-lstm.wasm.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0/tesseract-core-simd-lstm.wasm.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0/tesseract-core-relaxedsimd.wasm.js",
  "https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0/tesseract-core-relaxedsimd-lstm.wasm.js",
  "https://tessdata.projectnaptha.com/4.0.0_fast/slv.traineddata.gz",
  "https://tessdata.projectnaptha.com/4.0.0_fast/eng.traineddata.gz"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(async cache => {
      for (const url of CORE) {
        try { await cache.add(url); }
        catch (err) { console.warn("Cache skip", url, err); }
      }
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function offlineResponse(request) {
  const accept = request.headers.get("accept") || "";
  if (accept.includes("application/json")) {
    return new Response(JSON.stringify({
      ok: false,
      offline: true,
      error: "Ni internetne povezave."
    }), {
      status: 503,
      headers: {"Content-Type":"application/json; charset=utf-8"}
    });
  }

  return new Response("Ni internetne povezave.", {
    status: 503,
    headers: {"Content-Type":"text/plain; charset=utf-8"}
  });
}

async function warmAnalysisPack(){
  const cache=await caches.open(CACHE);
  for(const url of ANALYSIS_VENDOR){
    try{
      if(await cache.match(url))continue;
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),8000);
      const response=await fetch(url,{signal:controller.signal,mode:"cors"});
      clearTimeout(timer);
      if(response&&response.ok)await cache.put(url,response.clone());
    }catch(err){console.warn("Analysis pack skip",url,err)}
  }
}
self.addEventListener("message",event=>{
  if(event.data?.type==="WARM_ANALYSIS_PACK")event.waitUntil(warmAnalysisPack());
});

self.addEventListener("fetch", event => {
  const request=event.request;if(request.method!=="GET")return;
  const url=new URL(request.url),same=url.origin===self.location.origin;
  const vendor=(url.hostname==="cdn.jsdelivr.net"||url.hostname==="cdnjs.cloudflare.com"||url.hostname==="tessdata.projectnaptha.com");
  if(!same&&!vendor)return; // Cloudflare sync/push and other cross-origin traffic stays untouched.
  if(vendor){
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(request,copy)).catch(()=>{});return response}).catch(()=>offlineResponse(request))));return
  }
  if(request.mode==="navigate"){
    event.respondWith(fetch(request,{cache:"no-store"}).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy)).catch(()=>{})}return response}).catch(async()=>await caches.match("./index.html")||await caches.match("./")||offlineResponse(request)));return
  }
  event.respondWith(fetch(request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(request,copy)).catch(()=>{})}return response}).catch(async()=>await caches.match(request)||offlineResponse(request)))
});

self.addEventListener("push", event => {
  let data = {
    title:"📚 Moj Organizator",
    body:"Imaš novo obvestilo.",
    url:"./"
  };

  try {
    if (event.data) data = {...data, ...event.data.json()};
  } catch {
    try {
      if (event.data) data.body = event.data.text();
    } catch {}
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body:data.body,
      tag:data.tag || "moj-organizator",
      data:{url:data.url || "./"}
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = event.notification.data?.url || "./";

  event.waitUntil(
    clients.matchAll({type:"window", includeUncontrolled:true}).then(list => {
      for (const client of list) {
        if ("focus" in client) {
          try { client.navigate(target); } catch {}
          return client.focus();
        }
      }
      return clients.openWindow ? clients.openWindow(target) : Promise.resolve();
    })
  );
});
