/* =====================================================
   JOB TIME SERVICE WORKER + FIREBASE FCM
===================================================== */


/* =====================================================
   FIREBASE
===================================================== */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);


firebase.initializeApp({

  apiKey:
    "AIzaSyC2d9YhQYkDJpPz-kK9MFgoeN9JNhAOM",

  authDomain:
    "ola-job-f75b0.firebaseapp.com",

  projectId:
    "ola-job-f75b0",

  storageBucket:
    "ola-job-f75b0.firebasestorage.app",

  messagingSenderId:
    "619901142506",

  appId:
    "1:619901142506:web:bf1aec74f6448bf6ffde93",

  measurementId:
    "G-4DC0PHEQH1"

});


const messaging =
  firebase.messaging();


/* =====================================================
   CACHE
===================================================== */

const CACHE_NAME =
  "job-time-v4";


const FILES_TO_CACHE = [

  "./",

  "./index.html",

  "./manifest.json"

];


/* =====================================================
   INSTALL
===================================================== */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(
          CACHE_NAME
        )
        .then(
          cache => {

            return cache.addAll(
              FILES_TO_CACHE
            );

          }
        )

    );


    self.skipWaiting();

  }
);


/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys => {

            return Promise.all(

              keys

                .filter(
                  key =>
                    key !==
                    CACHE_NAME
                )

                .map(
                  key =>
                    caches.delete(
                      key
                    )
                )

            );

          }
        )

    );


    self.clients.claim();

  }
);


/* =====================================================
   FETCH
===================================================== */

self.addEventListener(
  "fetch",
  event => {

    event.respondWith(

      caches
        .match(
          event.request
        )
        .then(
          response => {

            return (
              response ||
              fetch(
                event.request
              )
            );

          }
        )

    );

  }
);


/* =====================================================
   FIREBASE BACKGROUND MESSAGE
===================================================== */

messaging.onBackgroundMessage(

  payload => {

    console.log(
      "[JOB TIME SW] Background message:",
      payload
    );


    const title =

      payload.notification?.title ||

      payload.data?.title ||

      "🔔 JOB TIME";


    const body =

      payload.notification?.body ||

      payload.data?.body ||

      "ถึงเวลาปฏิบัติงานแล้ว";


    const notificationOptions = {

      body:
        body,

      icon:
        "./icon-192.png",

      badge:
        "./icon-192.png",

      tag:
        payload.data?.tag ||
        "job-time",

      requireInteraction:
        true,

      vibrate:
        [300, 200, 300],

      data: {

        url:
          payload.data?.url ||
          "./"

      }

    };


    return self.registration.showNotification(

      title,

      notificationOptions

    );

  }

);


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

      clients
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
                "focus"
                in client
              ) {

                return client.focus();

              }

            }


            if (
              clients.openWindow
            ) {

              return clients.openWindow(
                url
              );

            }

          }
        )

    );

  }
);
