const CACHE="moj-organizator-v14-4-ios-share-fix";
const CORE=[
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon-180.png"
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

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  // Requests to Cloudflare sync/push are cross-origin and should never be
  // intercepted by this service worker. Let the browser handle them directly.
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, {cache:"no-store"})
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put("./index.html", copy)).catch(() => {});
          }
          return response;
        })
        .catch(async () => {
          const cached =
            await caches.match("./index.html") ||
            await caches.match("./");
          return cached || offlineResponse(request);
        })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        return cached || offlineResponse(request);
      })
  );
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
