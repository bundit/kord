import React from "react";
import { Route, Routes, useParams } from "react-router-dom";

import LibraryViewPage from "./library-view-page";
import PlaylistPage from "./playlist-page";

const LibraryRouter = () => {
  // Workaround to force PlaylistPage remount after page change until better logic flow later
  const { "*": urlPath } = useParams();

  return (
    <Routes>
      <Route path="/" element={<LibraryViewPage />} />
      <Route
        path="playlists/:source/:id/:title"
        element={<PlaylistPage key={urlPath} />}
      />
    </Routes>
  );
};

export default LibraryRouter;
