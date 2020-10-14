import { useSelector } from "react-redux";
import React from "react";

import { SOURCES } from "../utils/constants";
import { capitalizeWord, filterUnconnected } from "../utils/formattingHelpers";
import PlaylistList from "./playlist-list";
import styles from "../styles/library.module.css";

const LibraryList = () => {
  let playlists = useSelector(state => state.library.playlists);

  return (
    <div
      className={styles.pageWrapper}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {SOURCES.map(source => (
        <PlaylistSection
          source={source}
          playlists={filterUnconnected(playlists[source])}
          key={`Lib:${source}:Title`}
        />
      ))}
    </div>
  );
};

function PlaylistSection({ source, playlists }) {
  if (!playlists || !playlists.length) {
    return null;
  }

  return (
    <div className={styles.listWrapper}>
      <h2 style={{ marginTop: "50px" }} className={styles.listTitle}>
        {capitalizeWord(source)}
      </h2>
      <div className={`${styles.libraryWrapper} ${styles.playlistList}`}>
        <PlaylistList key={`Lib:${source}`} playlists={playlists} />
      </div>
    </div>
  );
}

export default LibraryList;
