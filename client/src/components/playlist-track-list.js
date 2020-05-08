import { useDispatch } from "react-redux";
import React, { useRef, useState } from "react";

import { capitalizeWord } from "../utils/capitalizeWord";
import { getSoundcloudLikes } from "../redux/actions/soundcloudActions";
import { getSpotifyPlaylistTracks } from "../redux/actions/spotifyActions";
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

  const handleLoadMoreTracks = React.useCallback(() => {
    const { source, id, next } = currentPlaylist;
    dispatch(loadMoreTracks(source, id, next));
  }, [dispatch, currentPlaylist]);

  useResetOnPlaylistChange(currentPlaylist, setNumShowTracks, scrollContainer);
  useLoadTracksIfEmpty(tracks, handleLoadMoreTracks);

  function showMoreTracks() {
    setNumShowTracks(numShowTracks + playlistIncrementAmount);
  }

  const loadTracksOnScroll = useLoadTracksOnScroll(
    tracks,
    numShowTracks,
    showMoreTracks,
    handleLoadMoreTracks
  );

  return (
    <div
      className={`${styles.pageWrapper} ${styles.tracksScrollContainer}`}
      ref={scrollContainer}
      onScroll={loadTracksOnScroll}
    >
      <div className={styles.listContainer}>
        <h2 className={styles.listTitle}>
          {capitalizeWord(currentPlaylist.title)}
        </h2>
        <div className={`${styles.libraryWrapper}`}>
          <TrackList
            tracks={tracks.slice(0, numShowTracks)}
            currentTrackID={currentTrackID}
            isPlaying={isPlaying}
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
    if (!tracks.length && loadMoreTracks) {
      handleLoadMoreTracks();
    }
  }, [tracks, handleLoadMoreTracks]);
}

const loadMoreTracks = (source, id, next) => dispatch => {
  if (!next) {
    return;
  }

  if (source === "spotify") {
    return dispatch(getSpotifyPlaylistTracks(id, next));
  } else if (source === "soundcloud" && id === "likes") {
    return dispatch(getSoundcloudLikes(next));
  }
};

export default PlaylistTracklist;
