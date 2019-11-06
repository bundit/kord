import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Library from "./components/pages/library";

const App = () => (
  <BrowserRouter>
    <Route path="/" component={Header} />
    <main className="content">
      <Route exact path="/" component={Library} />
    </main>
    <Route path="/" component={Footer} />
  </BrowserRouter>
);

export default App;
