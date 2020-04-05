import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

import {
  useAutoRefreshTokens,
  useHashParamDetectionOnLoad
} from "./utils/hooks";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import Library from "./components/library-page";
import NavHistory from "./components/nav-history";
import Search from "./components/search-page";
import Sidebar from "./components/sidebar";

const App = () => {
  useHashParamDetectionOnLoad();

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
