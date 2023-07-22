import React from "react";
import { Route, Routes } from "react-router-dom";

import LibraryViewPage from "./library-view-page";
import PlaylistPage from "./playlist-page";

const LibraryRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LibraryViewPage />} />
      <Route path="playlists/:source/:id/:title" element={<PlaylistPage />} />
    </Routes>
  );
};

export default LibraryRouter;
