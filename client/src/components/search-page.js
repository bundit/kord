import { Route } from "react-router-dom";
import React, { useEffect } from "react";

import SearchResults from "./search-results";
import styles from "../styles/library.module.css";

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
    <div className={styles.pageWrapper}>
      <Route exact path="/app/search" render={() => <h1>Search Page</h1>} />
      <Route exact path="/app/search/:query" component={SearchResults} />
    </div>
  );
};

export default SearchPage;
