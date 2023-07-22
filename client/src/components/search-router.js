import React from "react";
import { Route, Routes, useParams } from "react-router-dom";

import ArtistPage from "./artist-page";
import SearchHistoryPage from "./search-history-page";
import SearchResultsPage from "./search-results-page";

const SearchRouter = () => {
  // Workaround to force ArtistPage remount after page change until better logic flow later
  const { "*": urlPath } = useParams();

  return (
    <Routes>
      <Route path="/" element={<SearchHistoryPage />} />
      <Route path="/:query" element={<SearchResultsPage />} />
      <Route
        path="/artist/:source/:artistId/:artistName"
        element={<ArtistPage key={urlPath} />}
      />
    </Routes>
  );
};

export default SearchRouter;
