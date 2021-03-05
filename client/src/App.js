import { Route, Switch } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import * as Sentry from "@sentry/react";

import { closeSettings } from "./redux/actions/userActions";
import {
  useClearSessionStorageOnRefresh,
  useDetectWidevine,
  useKeepSessionAlive,
  useLoadUserDataOnMount
} from "./utils/hooks";
import AddToPlaylistForm from "./components/add-to-playlist-form";
import ControlsModal from "./components/controls-modal";
import DeleteTrackForm from "./components/delete-track-form";
import FallbackComponent from "./components/fallback-component";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import LibraryRouter from "./components/library-router";
import LoadingOverlay from "./components/loading-overlay";
import NavHistory from "./components/nav-history";
import SearchRouter from "./components/search-router";
import SettingsForm from "./components/settings-form";
import Sidebar from "./components/sidebar";
import UnsupportedBrowserModal from "./components/unsupported-browser-modal";

const App = () => {
  const dispatch = useDispatch();
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  useLoadUserDataOnMount(setIsLoadingUserData);
  useKeepSessionAlive();
  useClearSessionStorageOnRefresh();
  useDetectWidevine();

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

  return (
    <>
      <LoadingOverlay show={isLoadingUserData} />
      <NavHistory />
      <Route path="/app">
        <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
          <Sidebar />
        </Sentry.ErrorBoundary>
        <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
          <Route component={Header} />
        </Sentry.ErrorBoundary>
        <main className="content">
          <Switch>
            <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
              <Route path="/app/search" component={SearchRouter} />
              <Route path="/app/library" component={LibraryRouter} />

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
        </main>
        <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
          <Route component={Footer} />
        </Sentry.ErrorBoundary>
      </Route>
      <SettingsForm
        show={isSettingsOpen}
        source={settingsSource}
        onClose={handleCloseSettings}
      />
      <AddToPlaylistForm show={isAddToPlaylistFormOpen} />
      <DeleteTrackForm show={isDeleteTrackFormOpen} />
      <ControlsModal />
      <UnsupportedBrowserModal />
    </>
  );
};

export default App;
