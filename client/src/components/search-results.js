import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";

import { searchForMusic } from "../redux/actions/searchActions";
import SearchTrackList from "./search-track-list";

const SearchResults = () => {
  const isPlaying = useSelector(state => state.player.isPlaying);
  const currentTrackId = useSelector(state => state.player.currentTrack.id);
  const user = useSelector(state => state.user);
  const results = useSelector(state => state.search);
  const { query } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(searchForMusic(query));
  }, [query]);

  const resultsComponents = [];

  const sources = Object.keys(results);
  sources.forEach(source => {
    if (user[source] && user[source].isConnected) {
      const tracks = results[source].tracks;

      resultsComponents.push(
        <SearchTrackList
          source={source}
          tracks={tracks}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          key={`Search:${source}:${query}`}
        />
      );
    }
  });

  return resultsComponents;
};

export default SearchResults;
