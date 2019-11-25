import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Player from "./components/player";
import Library from "./components/library-page";
import Search from "./components/search-page";

const App = () => (
  <BrowserRouter>
    <Redirect from="/" to="/library" />
    <Route path="/" component={Header} />
    <main className="content">
      <Route path="/library" component={Library} />
      <Route exact path="/search" component={Search} />
    </main>
    <Route path="/" component={Player} />
    <Route path="/" component={Footer} />
  </BrowserRouter>
);

export default App;
