import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Route, Routes } from "react-router-dom";

import AddToPlaylistForm from "./components/add-to-playlist-form";
import ControlsModal from "./components/controls-modal";
import DeleteTrackForm from "./components/delete-track-form";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import LibraryRouter from "./components/library-router";
import LoadingOverlay from "./components/loading-overlay";
import NavHistory from "./components/nav-history";
import SearchRouter from "./components/search-router";
import SettingsForm from "./components/settings-form";
import Sidebar from "./components/sidebar";
import UnsupportedBrowserModal from "./components/unsupported-browser-modal";
import { closeSettings } from "./redux/actions/userActions";
import {
  useClearSessionStorageOnRefresh,
  useDetectWidevine,
  useKeepSessionAlive,
  useLoadUserDataOnMount
} from "./utils/hooks";

const App = () => {
  const dispatch = useDispatch();
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  useLoadUserDataOnMount(setIsLoadingUserData);
  useKeepSessionAlive();
  useClearSessionStorageOnRefresh();
  useDetectWidevine();

  const isSettingsOpen = useSelector(
    (state) => state.user.settings.isSettingsOpen
  );
  const settingsSource = useSelector(
    (state) => state.user.settings.settingsSource
  );
  const isAddToPlaylistFormOpen = useSelector(
    (state) => state.user.settings.isAddToPlaylistFormOpen
  );
  const isDeleteTrackFormOpen = useSelector(
    (state) => state.user.settings.isDeleteTrackFormOpen
  );

  function handleCloseSettings() {
    dispatch(closeSettings());
  }

  return (
    <>
      <LoadingOverlay show={isLoadingUserData} />
      <NavHistory />
      <Routes>
        <Route
          path="/app"
          element={
            <>
              <Sidebar />
              <Header />
              <main className="content">
                <Outlet />
              </main>
              <Footer />
            </>
          }
        >
          <Route path="library/*" element={<LibraryRouter />} />
          <Route path="search/*" element={<SearchRouter />} />
          <Route
            path="explore"
            element={
              <h1
                style={{
                  margin: "0 auto",
                  fontFamily: "Pacifico",
                  color: "#ccc",
                  fontSize: "45px",
                  fontWeight: "300"
                }}
              >
                Coming soon!
              </h1>
            }
          />
        </Route>
      </Routes>
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
