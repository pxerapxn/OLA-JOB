const CACHE_NAME = "job-time-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

/*
  รับ Push Notification
*/

self.addEventListener("push", event => {

  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: "JOB TIME",
      body: event.data ? event.data.text() : "ถึงเวลาปฏิบัติงานแล้ว"
    };
  }

  const title = data.title || "JOB TIME";

  const options = {
    body: data.body || "ถึงเวลาปฏิบัติงานแล้ว",
    icon: data.icon || "",
    badge: data.badge || "",
    tag: data.tag || "job-time",
    requireInteraction: true,
    vibrate: [300, 200, 300],
    data: {
      url: data.url || "./"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


/*
  เมื่อผู้ใช้กด Notification
*/

self.addEventListener("notificationclick", event => {

  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(clientList => {

      for (const client of clientList) {

        if ("focus" in client) {
          return client.focus();
        }

      }

      if (clients.openWindow) {
        return clients.openWindow("./");
      }

    })
  );
});
