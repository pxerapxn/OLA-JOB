/* =====================================================
   FIREBASE MESSAGING SERVICE WORKER
===================================================== */


importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);


importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);


/* =====================================================
   FIREBASE CONFIG
===================================================== */

firebase.initializeApp({

  apiKey:
    "AIzaSyC2d9YhQYkJDJpPz-kK9MFgoeN9JNhAOM",

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
   BACKGROUND MESSAGE
===================================================== */

messaging.onBackgroundMessage(
  function(payload){

    console.log(
      "[firebase-messaging-sw.js] Background message:",
      payload
    );


    const notificationTitle =
      payload.notification?.title ||
      payload.data?.title ||
      "🔔 JOB TIME";


    const notificationOptions = {

      body:
        payload.notification?.body ||
        payload.data?.body ||
        "ถึงเวลาปฏิบัติงานแล้ว",

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
        [
          300,
          200,
          300
        ],

      data: {

        url:
          payload.data?.url ||
          "./"

      }

    };


    return self.registration.showNotification(

      notificationTitle,

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

            for(
              const client
              of clientList
            ){

              if(
                "focus" in client
              ){

                return client.focus();

              }

            }


            if(
              clients.openWindow
            ){

              return clients.openWindow(
                url
              );

            }

          }
        )

    );

  }
);
