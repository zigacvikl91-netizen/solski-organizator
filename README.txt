MOJ ORGANIZATOR – V11 AUTO PUSH

- Novi VAPID public key je vgrajen.
- Učni bloki se samodejno sinhronizirajo na Cloudflare Worker.
- Dodaj uro / Prestavi uro / Odstrani / Končano samodejno posodobijo oddaljene opomnike.
- Dodan je status Cloud opomnikov in gumb »Preveri strežnik«.
- Ob zagonu se prihodnji učni bloki ponovno sinhronizirajo.

PUSH SERVER:
https://solski-organizator-push.ziga-cvikl91.workers.dev

NUJNO PRED TESTOM:
1. GitHub Secret VAPID_PUBLIC_KEY zamenjaj z novim javnim ključem.
2. GitHub Secret VAPID_PRIVATE_KEY zamenjaj z novim zasebnim ključem.
3. Naloži V11 na GitHub Pages.
4. Na iPhonu ponovno klikni Poveži Web Push.
5. Novo naročnino kopiraj v GitHub Secret PUSH_SUBSCRIPTION.


V12.1 – POPRAVLJENA RAZLIČICA
- Dodana in ohranjena 3D uvodna knjiga.
- Ohranjeni Web Push in Cloudflare samodejni opomniki.
- Popravljen iPhone safe-area/status bar odmik.
- Popravljena bela kartica učnega bloka in svetlo besedilo v temnem načinu.
- Popravljen kontrast statusov obvestil.
- Urejena sekcija »Hitro dodaj«.
- Lepši uvoz pod »Obnovi podatke«.
- Posodobljen Service Worker cache.
