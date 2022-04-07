import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Providers from "./Providers";

// const $element = document.getElementById("root");
// if (!$element) throw new Error("Root element not found");

// const root = ReactDOM.createRoot($element);

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
