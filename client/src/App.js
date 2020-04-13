import { Provider as AlertProvider } from "react-alert";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AlertTemplate from "react-alert-template-basic";
import React from "react";

import { useHashParamDetectionOnLoad } from "./utils/hooks";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import Library from "./components/library-page";
import NavHistory from "./components/nav-history";
import Search from "./components/search-page";
import Sidebar from "./components/sidebar";

const options = {
  position: "bottom center",
  timeout: 3500,
  offset: "30px",
  transition: "scale"
};

const App = () => {
  useHashParamDetectionOnLoad();

  return (
    <BrowserRouter>
      <AlertProvider template={AlertTemplate} {...options}>
        <NavHistory />
        <Route path="/app">
          <Sidebar />
          <main className="content">
            <Route component={Header} />
            <Switch>
              <Route exact path="/app/search" component={Search} />
              <Route path="/app/library" component={Library} />
            </Switch>
            <Route component={Footer} />
          </main>
        </Route>
      </AlertProvider>
    </BrowserRouter>
  );
};

export default App;
