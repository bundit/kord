import { useSelector } from "react-redux";
import React from "react";

import { SOURCES } from "../utils/constants";
import { capitalizeWord, filterUnconnected } from "../utils/formattingHelpers";
import PlaylistList from "./playlist-list";
import styles from "../styles/library-view-page.module.scss";

const LibraryViewPage = () => {
  let playlists = useSelector(state => state.library.playlists);

  return (
    <div className={styles.pageWrapper}>
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

  const playlistSectionTitle = `${capitalizeWord(source)} Playlists`;

  return (
    <div className={styles.pageSectionWrapper}>
      <h2 className={styles.sectionTitle}>{playlistSectionTitle}</h2>
      <div className={styles.playlistList}>
        <PlaylistList key={`Lib:${source}`} playlists={playlists} />
      </div>
    </div>
  );
}

export default LibraryViewPage;
