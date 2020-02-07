import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LandingPage from "./components/landing-page";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Player from "./components/player";
import Library from "./components/library-page";
import Search from "./components/search-page";
import NavHistory from "./components/nav-history";

const App = () => (
  <BrowserRouter>
    <NavHistory />
    <Switch>
      <Route exact path="/" component={LandingPage} />

      <Route>
        <Route component={Header} />
        <Player />
        <main className="content">
          <Switch>
            <Route exact path="/search" component={Search} />
            <Route path="/library" component={Library} />
          </Switch>
        </main>
        <Route component={Footer} />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
