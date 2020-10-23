import { useSelector } from "react-redux";
import React from "react";

import { SOURCES } from "../utils/constants";
import { capitalizeWord, filterUnconnected } from "../utils/formattingHelpers";
import { flattenPlaylistObject } from "../utils/flattenPlaylistObject";
import PlaylistList from "./playlist-list";
import styles from "../styles/library-view-page.module.scss";

const LibraryViewPage = () => {
  const playlists = useSelector(state => state.library.playlists);

  const playlistSections = [
    {
      title: "Favorited Playlists",
      playlists: flattenPlaylistObject(playlists).filter(
        playlist => playlist.isStarred
      )
    },
    ...SOURCES.map(source => ({
      title: `${capitalizeWord(source)} Playlists`,
      playlists: filterUnconnectedAndStarred(playlists[source])
    }))
  ];

  return (
    <div className={styles.pageWrapper}>
      {playlistSections.map(section => (
        <PlaylistSection
          title={section.title}
          playlists={section.playlists}
          key={`Lib:${section.title}:Title`}
        />
      ))}
    </div>
  );
};

function filterUnconnectedAndStarred(playlists) {
  return filterUnconnected(playlists).filter(playlist => !playlist.isStarred);
}

function PlaylistSection({ title, playlists }) {
  if (!playlists || !playlists.length) {
    return null;
  }

  return (
    <section className={styles.pageSectionWrapper}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.playlistList}>
        <PlaylistList key={`Lib:${title}`} playlists={playlists} />
      </div>
    </section>
  );
}

export default LibraryViewPage;
