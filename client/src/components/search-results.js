import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useParams } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import queryString from "query-string";

import { searchForMusic } from "../redux/actions/searchActions";
import SearchTrackList from "./search-track-list";
import styles from "../styles/library.module.css";

const SearchResults = () => {
  const isPlaying = useSelector(state => state.player.isPlaying);
  const currentTrackId = useSelector(state => state.player.currentTrack.id);
  const user = useSelector(state => state.user);
  const results = useSelector(state => state.search);
  const { query } = useParams();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { restored } = queryString.parse(search);

  useEffect(() => {
    dispatch(searchForMusic(query)).catch(e => {
      alert.error("Search Error");
    });
    // eslint-disable-next-line
  }, [query, dispatch]);

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
          restored={restored}
        />
      );
    }
  });

  return (
    <div style={{ overflowY: "scroll", margin: "80px 0" }}>
      <h3
        className={styles.listTitle}
        style={{ color: "#aaa", fontSize: "20px" }}
      >
        {`Showing search results for "${query}" `}
        <br />
        <span>
          <Link to="/app/search" className={styles.returnToSearchButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            {" Return to search page"}
          </Link>
        </span>
      </h3>
      <div className={styles.pageWrapper} style={{ margin: 0 }}>
        {resultsComponents}
      </div>
    </div>
  );
};

export default SearchResults;
