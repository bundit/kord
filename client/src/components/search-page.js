import { Route } from "react-router-dom";
import React, { useEffect } from "react";

import ArtistPage from "./artist-page";
import SearchHistory from "./search-history";
import SearchResults from "./search-results";

// For restoring scroll position when component is unmounted
let searchScrollPosition = null;

const SearchPage = () => {
  useEffect(() => {
    if (searchScrollPosition) {
      document.querySelector("html").scrollTop = searchScrollPosition;
    }
    return () =>
      (searchScrollPosition = document.querySelector("html").scrollTop);
  }, []);

  return (
    <>
      <Route exact path="/app/search" component={SearchHistory} />
      <Route exact path="/app/search/:query" component={SearchResults} />
      <Route
        exact
        path="/app/search/artist/:source/:artistId/:artistName"
        component={ArtistPage}
      />
    </>
  );
};

export default SearchPage;
