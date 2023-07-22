import React from "react";
import { Route, Routes } from "react-router-dom";

import ArtistPage from "./artist-page";
import SearchHistoryPage from "./search-history-page";
import SearchResultsPage from "./search-results-page";

const SearchRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<SearchHistoryPage />} />
      <Route path="/:query" element={<SearchResultsPage />} />
      <Route
        path="/artist/:source/:artistId/:artistName"
        element={<ArtistPage />}
      />
    </Routes>
  );
};

export default SearchRouter;
