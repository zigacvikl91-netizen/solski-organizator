
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({"apiKey": "AIzaSyAEk5q4QYFLw_0i8Wag5BG_vQYiL5prwXQ", "authDomain": "solski-organizator.firebaseapp.com", "projectId": "solski-organizator", "storageBucket": "solski-organizator.firebasestorage.app", "messagingSenderId": "79449291742", "appId": "1:79449291742:web:fc91eeb606430bc0fcbb4f"});
const messaging=firebase.messaging();

messaging.onBackgroundMessage(payload=>{
  const n=payload.notification||{};
  const d=payload.data||{};
  self.registration.showNotification(n.title||d.title||"Šolski organizator",{
    body:n.body||d.body||"Imaš novo obvestilo.",
    icon:"./icon-192.png",
    badge:"./icon-192.png",
    data:{url:d.url||"./"}
  });
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const url=event.notification.data?.url||"./";
  event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if("focus" in c)return c.focus()}
    if(clients.openWindow)return clients.openWindow(url);
  }));
});
