Moj Organizator V13.2

Spremembe:
- Ohranjena delujoča V13.1 sinhronizacija prek Cloudflare D1.
- Verzija aplikacije je V13.2.
- Service Worker je utrjen: ob offline/cache napaki vedno vrne veljaven Response.
- Cross-origin zahteve za Cloudflare sync/push Service Worker ne prestreza.
- Popravljena je možnost napake: FetchEvent.respondWith ... Returned response is null.
- Dizajn in ostale funkcije niso spreminjane.

GitHub:
Naloži index.html, sw.js, manifest.json in mapo icons.
Cloudflare Worker:
cloudflare-sync-worker.js je referenčna kopija trenutno pravilne sync kode.
