import { initializeApp } from "firebase/app";

import {
  getMessaging,
  getToken as getRawToken,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAWnrIrNfQxSXFscOksP7xSNKU2mWas5C0",
  authDomain: "nourisha-c326f.firebaseapp.com",
  projectId: "nourisha-c326f",
  storageBucket: "nourisha-c326f.appspot.com",
  messagingSenderId: "165314613042",
  appId: "1:165314613042:web:b0398ad30e20817946d12b",
  measurementId: "G-53XYVDJ0X4",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getToken = async () => {
  const token = await getRawToken(messaging, {
    vapidKey:
      "BKDH2bChFX5eHfizUhTPp4zpoQDJ2VoeW35cNdjlgONt-hTlFtPloC_7g2_5puooRzUKnr_mxrcOABC9LqxXYyo",
  }).catch((err) => console.log("Token request error", err));

  return token;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
