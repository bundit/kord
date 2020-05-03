import { useSelector } from "react-redux";
import React from "react";

import { capitalizeWord } from "../utils/capitalizeWord";
import PlaylistList from "./playlist-list";
import styles from "../styles/library.module.css";

const LibraryList = () => {
  let playlists = useSelector(state => state.library.playlists);
  const keys = Object.keys(playlists);

  let components = [];
  keys.forEach(key => {
    const numConnected = countNumConnected(playlists[key]);

    if (numConnected > 0) {
      components.push(
        <div className={styles.listWrapper} key={`Lib:${key}:Title`}>
          <h2 style={{ marginTop: "50px" }} className={styles.listTitle}>
            {capitalizeWord(key)}
          </h2>
          <PlaylistList key={`Lib:${key}`} playlists={playlists[key]} />
        </div>
      );
    }
  });

  return (
    <div className={styles.pageWrapper} style={{ flexDirection: "column" }}>
      {components}
    </div>
  );
};

function countNumConnected(playlists) {
  let numConnected = 0;

  playlists.forEach(playlist => {
    if (playlist.isConnected) {
      numConnected++;
    }
  });

  return numConnected;
}

export default LibraryList;
