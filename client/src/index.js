import "./index.css";

import { Provider as AlertProvider } from "react-alert";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import AlertTemplate from "react-alert-template-basic";
import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import store from "./redux/store";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DNS
});

const alertOptions = {
  position: "bottom center",
  timeout: 3500,
  offset: "90px",
  transition: "scale"
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <App />
      </AlertProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
