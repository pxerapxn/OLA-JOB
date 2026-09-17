/* =====================================================
   JOB TIME WEB PUSH SERVICE WORKER
===================================================== */

const CACHE_NAME = "job-time-webpush-v1";


/* =====================================================
   INSTALL
===================================================== */

self.addEventListener("install", event => {

  console.log(
    "[JOB TIME] Service Worker installing"
  );

  self.skipWaiting();

});


/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener("activate", event => {

  console.log(
    "[JOB TIME] Service Worker activated"
  );

  event.waitUntil(
    self.clients.claim()
  );

});


/* =====================================================
   PUSH
===================================================== */

self.addEventListener("push", event => {

  console.log(
    "[JOB TIME] PUSH received"
  );


  let data = {};


  try {

    if (event.data) {

      data = event.data.json();

    }

  } catch (error) {

    console.error(
      "[JOB TIME] Push JSON error:",
      error
    );

  }


  const title =
    data.title ||
    "🔔 JOB TIME";


  const body =
    data.body ||
    "ถึงเวลาปฏิบัติงานแล้ว";


  const options = {

    body: body,

    icon:
      "./icon-192.png",

    badge:
      "./icon-192.png",

    tag:
      data.tag ||
      "job-time",

    requireInteraction:
      true,

    vibrate:
      [
        300,
        200,
        300
      ],

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

          type:
            "window",

          includeUncontrolled:
            true

        })

        .then(
          clientList => {

            for (
              const client
              of clientList
            ) {

              if (
                "focus" in client
              ) {

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

          }
        )

    );

  }
);
