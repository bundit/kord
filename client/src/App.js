import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Sidebar from "./components/sidebar";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Library from "./components/library-page";
import Search from "./components/search-page";
import NavHistory from "./components/nav-history";

const App = props => {
  const { setSpotifyAccessToken } = props;

  useEffect(() => {
    if (window.location.hash) {
      // Get hash params excluding first #
      const URLParams = new URLSearchParams(window.location.hash.substr(1));
      const source = URLParams.get("source");

      if (source === "spotify") {
        const accessToken = URLParams.get("spotifyToken");
        setSpotifyAccessToken(accessToken);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <NavHistory />
      <Route path="/app">
        <div
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "fixed",
            height: "100vh",
            width: "100vw",
            display: "flex"
          }}
        >
          <Sidebar />
          <div
            style={{
              height: "100vh",
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <main className="content">
              <Route component={Header} />
              <Switch>
                <Route exact path="/app/search" component={Search} />
                <Route path="/app/library" component={Library} />
              </Switch>
              <Route component={Footer} />
            </main>
          </div>
        </div>
      </Route>
    </BrowserRouter>
  );
};

const mapDispatchToProps = dispatch => ({
  setSpotifyAccessToken: token =>
    dispatch({
      type: "SET_SPOTIFY_ACCESS_TOKEN",
      payload: token
    })
});

export default connect(
  null,
  mapDispatchToProps
)(App);
