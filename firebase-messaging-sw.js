importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyC2d9YhQYkDJpPz-kK9MFgoeN9JNhAOM",
  authDomain: "ola-job-f75b0.firebaseapp.com",
  projectId: "ola-job-f75b0",
  storageBucket: "ola-job-f75b0.firebasestorage.app",
  messagingSenderId: "619901142506",
  appId: "1:619901142506:web:bf1aec74f6448bf6ffde93",
  measurementId: "G-4DC0PHEQH1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  console.log(
    "[firebase-messaging-sw.js] Background message:",
    payload
  );

  const notificationTitle =
    payload.notification?.title || "🔔 JOB TIME";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "ถึงเวลาปฏิบัติงานแล้ว",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: "job-time",
    requireInteraction: true,
    vibrate: [300, 200, 300]
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
