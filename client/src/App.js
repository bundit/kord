import { Route, Switch } from "react-router-dom";
import React from "react";

import { useHashParamDetectionOnLoad } from "./utils/hooks";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import Library from "./components/library-page";
import NavHistory from "./components/nav-history";
import SearchPage from "./components/search-page";
import Sidebar from "./components/sidebar";

const App = () => {
  useHashParamDetectionOnLoad();

  return (
    <>
      <NavHistory />
      <Route path="/app">
        <Sidebar />
        <main className="content">
          <Route component={Header} />
          <Switch>
            <Route path="/app/search" component={SearchPage} />
            <Route path="/app/library" component={Library} />
            <Route
              path="/app/explore"
              render={() => (
                <h1
                  style={{
                    marginTop: "150px",
                    marginLeft: "50px",
                    fontFamily: "Pacifico",
                    color: "#ccc",
                    fontSize: "45px",
                    fontWeight: "300"
                  }}
                >
                  Coming soon!
                </h1>
              )}
            />
          </Switch>
          <Route component={Footer} />
        </main>
      </Route>
    </>
  );
};

export default App;
