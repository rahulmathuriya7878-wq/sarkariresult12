// Import and configure the Firebase SDK for Third-party services in Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAUHu5pBkiwcE-f1XwboCQD7H24g_pxrok",
  authDomain: "youthful-team-22w8r.firebaseapp.com",
  projectId: "youthful-team-22w8r",
  storageBucket: "youthful-team-22w8r.firebasestorage.app",
  messagingSenderId: "863345379551",
  appId: "1:863345379551:web:16d7bcfb3151df3c38c16a"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Sarkari Result Alert 🔔';
  const notificationOptions = {
    body: payload.notification?.body || 'Important government job update received.',
    icon: '/favicon.ico',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
