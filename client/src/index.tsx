import "./index.css";

import * as Sentry from "@sentry/react";
import { Provider as AlertProvider, AlertProviderProps } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import store from "./redux/store";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DNS
});

const alertOptions: AlertProviderProps = {
  template: AlertTemplate,
  position: "bottom center",
  timeout: 3500,
  offset: "90px",
  transition: "scale"
};

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AlertProvider {...alertOptions}>
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
