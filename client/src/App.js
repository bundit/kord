import { Route, Switch } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Sentry from "@sentry/react";

import { closeSettings, updateProfile } from "./redux/actions/userActions";
import {
  useHashParamDetectionOnLoad,
  useKeepSessionAlive
} from "./utils/hooks";
import AddToPlaylistForm from "./components/add-to-playlist-form";
import DeleteTrackForm from "./components/delete-track-form";
import FallbackComponent from "./components/fallback-component";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import Library from "./components/library-page";
import NavHistory from "./components/nav-history";
import SearchPage from "./components/search-page";
import SettingsForm from "./components/settings-form";
import Sidebar from "./components/sidebar";

const App = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  useHashParamDetectionOnLoad();
  useKeepSessionAlive();

  const isSettingsOpen = useSelector(
    state => state.user.settings.isSettingsOpen
  );
  const settingsSource = useSelector(
    state => state.user.settings.settingsSource
  );
  const isAddToPlaylistFormOpen = useSelector(
    state => state.user.settings.isAddToPlaylistFormOpen
  );
  const isDeleteTrackFormOpen = useSelector(
    state => state.user.settings.isDeleteTrackFormOpen
  );

  function handleCloseSettings() {
    dispatch(closeSettings());
  }

  function handleUpdateProfile(source, user) {
    return dispatch(updateProfile(source, user))
      .then(() => {
        alert.success("Profile Refreshed");
      })
      .catch(e => {
        if (e.status === 0) {
          alert.error("Connection Error");
        } else {
          alert.error(`Unhandled Error${e.status}`);
        }
      });
  }

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
      <SettingsForm
        show={isSettingsOpen}
        source={settingsSource}
        onClose={handleCloseSettings}
        handleUpdate={handleUpdateProfile}
      />
      <AddToPlaylistForm show={isAddToPlaylistFormOpen} />
      <DeleteTrackForm show={isDeleteTrackFormOpen} />
    </>
  );
};

export default App;
