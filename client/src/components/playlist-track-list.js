import { useDispatch } from "react-redux";
import React, { useRef, useState } from "react";

import { capitalizeWord } from "../utils/formattingHelpers";
import { loadPlaylistTracks } from "../redux/actions/libraryActions";
import { playTrack } from "../redux/actions/playerActions";
import { usePrevious } from "../utils/hooks";
import TrackList from "./track-list";
import styles from "../styles/library.module.css";

const playlistIncrementAmount = 25;

const PlaylistTracklist = ({
  source,
  id,
  isPlaying,
  playlists,
  currentTrackID
}) => {
  const dispatch = useDispatch();
  const scrollContainer = useRef(null);
  const [numShowTracks, setNumShowTracks] = useState(playlistIncrementAmount);
  // eslint-disable-next-line
  const playlistIndex = playlists[source].findIndex(p => p.id == id);
  const currentPlaylist = playlists[source][playlistIndex] || {};
  const tracks = currentPlaylist.tracks || [];

  const dispatchLoadMoreTracks = React.useCallback(() => {
    const { source, id, next } = currentPlaylist;
    dispatch(loadPlaylistTracks(source, id, next));
  }, [dispatch, currentPlaylist]);

  useResetOnPlaylistChange(currentPlaylist, setNumShowTracks, scrollContainer);
  useLoadTracksIfEmpty(tracks, dispatchLoadMoreTracks);

  function showMoreTracks() {
    setNumShowTracks(numShowTracks + playlistIncrementAmount);
  }

  const loadTracksOnScroll = useLoadTracksOnScroll(
    tracks,
    numShowTracks,
    showMoreTracks,
    dispatchLoadMoreTracks
  );

  function dispatchPlayTrack(index) {
    dispatch(playTrack(index, tracks, currentPlaylist.next));
  }

  return (
    <div
      className={`${styles.pageWrapper} ${styles.tracksScrollContainer}`}
      ref={scrollContainer}
      onScroll={loadTracksOnScroll}
    >
      <div
        className={styles.listContainer}
        style={{ backgroundColor: "inherit" }}
      >
        <h2 className={styles.listTitle}>
          {capitalizeWord(currentPlaylist.title)}
        </h2>
        <div className={`${styles.libraryWrapper}`}>
          <TrackList
            tracks={tracks.slice(0, numShowTracks)}
            currentTrackID={currentTrackID}
            isPlaying={isPlaying}
            handlePlay={dispatchPlayTrack}
          />
        </div>
      </div>
    </div>
  );
};

function useResetOnPlaylistChange(
  currentPlaylist,
  setNumShowTracks,
  scrollContainer
) {
  const prevTracklistId = usePrevious(currentPlaylist.id);

  React.useEffect(() => {
    if (prevTracklistId === currentPlaylist.id) return;

    setNumShowTracks(playlistIncrementAmount);
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({ top: 0, left: 0 });
    }
  }, [prevTracklistId, currentPlaylist.id, scrollContainer, setNumShowTracks]);
}

function useLoadTracksOnScroll(
  tracks,
  numCurrentlyShown,
  showMoreTracks,
  loadMoreTracks
) {
  return function(e) {
    const eScrollTop = e.target.scrollTop;
    const eHeight = e.target.getBoundingClientRect().height;
    const eScrollHeight = e.target.scrollHeight - 10;
    if (eScrollTop + eHeight >= eScrollHeight) {
      showMoreTracks();
      if (tracks.length <= numCurrentlyShown) {
        loadMoreTracks();
      }
    }
  };
}

function useLoadTracksIfEmpty(tracks, handleLoadMoreTracks) {
  React.useEffect(() => {
    if (!tracks.length) {
      handleLoadMoreTracks();
    }
  }, [tracks, handleLoadMoreTracks]);
}

export default PlaylistTracklist;
