import React, { useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Player from "./components/player";
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
        <Route component={Header} />
        <Player />
        <main className="content">
          <Switch>
            <Route exact path="/app/search" component={Search} />
            <Route path="/app/library" component={Library} />
          </Switch>
        </main>
        <Route component={Footer} />
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
