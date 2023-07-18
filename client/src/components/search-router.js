import React from "react";
import { Route } from "react-router-dom";

import ArtistPage from "./artist-page";
import SearchHistoryPage from "./search-history-page";
import SearchResultsPage from "./search-results-page";

const SearchRouter = () => {
  return (
    <>
      <Route exact path="/app/search" component={SearchHistoryPage} />
      <Route exact path="/app/search/:query" component={SearchResultsPage} />
      <Route
        exact
        path="/app/search/artist/:source/:artistId/:artistName"
        render={({
          match: {
            params: { source, artistId, artistName }
          }
        }) => <ArtistPage key={`artist/${source}:${artistId}:${artistName}`} />}
      />
    </>
  );
};

export default SearchRouter;
