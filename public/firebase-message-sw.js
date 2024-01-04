'use strict';
/* eslint-disable no-undef */

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAWnrIrNfQxSXFscOksP7xSNKU2mWas5C0",
  authDomain: "nourisha-c326f.firebaseapp.com",
  projectId: "nourisha-c326f",
  storageBucket: "nourisha-c326f.appspot.com",
  messagingSenderId: "165314613042",
  appId: "1:165314613042:web:b0398ad30e20817946d12b",
  measurementId: "G-53XYVDJ0X4",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

