import { Route } from "react-router-dom";
import React from "react";

import LibraryViewPage from "./library-view-page";
import PlaylistPage from "./playlist-page";

const LibraryRouter = () => {
  return (
    <>
      <Route exact path="/app/library" component={LibraryViewPage} />
      <Route
        exact
        path="/app/library/playlists/:source/:id/:title"
        render={({
          match: {
            params: { source, id, title }
          }
        }) => <PlaylistPage key={`playlists/${source}:${id}:${title}`} />}
      />
    </>
  );
};

export default LibraryRouter;
