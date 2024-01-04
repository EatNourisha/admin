import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Providers from "./Providers";
import { isProd } from "config";

import { Buffer } from "buffer";
(window as any).Buffer = Buffer;

// const $element = document.getElementById("root");
// if (!$element) throw new Error("Root element not found");

// const root = ReactDOM.createRoot($element);

(window as any).log = console.log;
// Disable console logs in production.
isProd && (console.log = () => {});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(`${process.env.PUBLIC_URL}/firebase-message-sw.js`, {
      scope: "/",
    })
    .then((reg) => {
      console.log("Service worker ready", reg);
    });

  navigator.serviceWorker.ready.then((reg) => {
    console.log("Service worker ready", reg);
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
