import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";
// import Library from "./components/library";

const App = () => (
  <BrowserRouter>
    <Route path="/" component={Header} />
    <main className="content">
      {/* <Route exact path="/" component={Library} /> */}
    </main>
    <Route path="/" component={Footer} />
  </BrowserRouter>
);

export default App;
