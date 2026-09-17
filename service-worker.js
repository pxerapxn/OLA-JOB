/* =====================================================
   JOB TIME - PUSH NOTIFICATION SERVICE WORKER
===================================================== */

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    self.clients.claim()
  );
});


/* =====================================================
   RECEIVE PUSH
===================================================== */

self.addEventListener("push", event => {

  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    console.log("Push data is not JSON");

    data = {
      title: "🔔 JOB TIME",
      body: event.data
        ? event.data.text()
        : "ถึงเวลาปฏิบัติงานแล้ว"
    };
  }


  const title =
    data.title || "🔔 JOB TIME";


  const options = {

    body:
      data.body ||
      "ถึงเวลาปฏิบัติงานแล้ว",

    icon:
      "./icon-192.png",

    badge:
      "./icon-192.png",

    tag:
      data.tag ||
      "job-time",

    requireInteraction:
      true,

    data: {
      url:
        data.url ||
        "./"
    }

  };


  event.waitUntil(

    self.registration.showNotification(
      title,
      options
    )

  );

});


/* =====================================================
   NOTIFICATION CLICK
===================================================== */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();


    const url =
      event.notification?.data?.url ||
      "./";


    event.waitUntil(

      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })

        .then(clients => {

          for (const client of clients) {

            if ("focus" in client) {

              return client.focus();

            }

          }


          if (
            self.clients.openWindow
          ) {

            return self.clients.openWindow(
              url
            );

          }

        })

    );

  }
);
