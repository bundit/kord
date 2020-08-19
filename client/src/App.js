import { Route, Switch } from "react-router-dom";
import React from "react";
import * as Sentry from "@sentry/react";

import {
  useHashParamDetectionOnLoad,
  useKeepSessionAlive
} from "./utils/hooks";
import FallbackComponent from "./components/fallback-component";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import Library from "./components/library-page";
import NavHistory from "./components/nav-history";
import SearchPage from "./components/search-page";
import Sidebar from "./components/sidebar";

const App = () => {
  useHashParamDetectionOnLoad();
  useKeepSessionAlive();

  return (
    <>
      <NavHistory />
      <Route path="/app">
        <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
          <Sidebar />
          <FallbackComponent />
        </Sentry.ErrorBoundary>
        <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
          <Route component={Header} />
        </Sentry.ErrorBoundary>
        <main className="content">
          <Switch>
            <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
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
            </Sentry.ErrorBoundary>
          </Switch>
          <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
            <Route component={Footer} />
          </Sentry.ErrorBoundary>
        </main>
      </Route>
    </>
  );
};

export default App;
