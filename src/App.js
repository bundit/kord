import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Player from "./components/player";
import Library from "./components/library-page";
import Search from "./components/search-page";

const App = () => (
  <BrowserRouter>
    <Route path="/" component={Header} />
    <main className="content">
      <Route exact path="/" component={Library} />
      <Route exact path="/search" component={Search} />
    </main>
    <Route path="/" component={Player} />
    <Route path="/" component={Footer} />
  </BrowserRouter>
);

export default App;
