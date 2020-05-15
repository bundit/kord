import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSync } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
import React, { useRef, useState } from "react";

import { capitalizeWord } from "../utils/formattingHelpers";
import {
  clearPlaylistTracks,
  loadLikes,
  loadPlaylistTracks
} from "../redux/actions/libraryActions";
import { getImgUrl } from "../utils/getImgUrl";
import { playPlaylist, playTrack } from "../redux/actions/playerActions";
import { timeSince } from "../utils/dateHelpers";
import { usePrevious } from "../utils/hooks";
import LoadingSpinner from "./loading-spinner";
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
  const alert = useAlert();
  const scrollContainer = useRef(null);
  const [numShowTracks, setNumShowTracks] = useState(playlistIncrementAmount);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line
  const playlistIndex = playlists[source].findIndex(p => p.id == id);
  const currentPlaylist = playlists[source][playlistIndex] || {};
  const tracks = currentPlaylist.tracks || [];

  const { next, total } = currentPlaylist;

  const dispatchLoadMoreTracks = React.useCallback(() => {
    if (isLoading || !next || total === 0) {
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      let promise;
      if (id === "likes" && tracks.length === 0) {
        promise = dispatch(loadLikes(source));
      } else {
        promise = dispatch(loadPlaylistTracks(source, id, next));
      }

      promise
        .then(() => {
          if (hasRefreshed) {
            alert.success("Playlist refreshed");
            setHasRefreshed(true);
          }
        })
        .catch(e => {
          alert.error("Error loading tracks");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 1000);
  }, [
    isLoading,
    next,
    total,
    id,
    tracks.length,
    source,
    hasRefreshed,
    dispatch,
    alert
  ]);

  React.useEffect(() => {
    setHasRefreshed(false);
    setIsLoading(false);
  }, [id, source]);

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

  function handleRefresh() {
    setHasRefreshed(true);
    dispatch(clearPlaylistTracks(source, currentPlaylist.id));
  }

  function handlePlayPlaylist(e) {
    dispatch(playPlaylist(currentPlaylist));

    e.stopPropagation();
    e.preventDefault();
  }

  return (
    !isEmptyObject(currentPlaylist) && (
      <div
        className={`${styles.pageWrapper} ${styles.tracksScrollContainer}`}
        ref={scrollContainer}
        onScroll={loadTracksOnScroll}
      >
        <div
          className={styles.listContainer}
          style={{ backgroundColor: "inherit" }}
        >
          <div className={styles.playlistHeader}>
            <div
              className={styles.playlistImageWrap}
              style={{
                width: "200px",
                height: "200px",
                paddingTop: 0,
                marginLeft: "20px"
              }}
            >
              <img
                src={getImgUrl(currentPlaylist, "lg")}
                alt={`${currentPlaylist.title}-art`}
              />
            </div>

            <div className={styles.listTitleWrapper}>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <h2
                  className={styles.listTitle}
                  style={{ paddingLeft: 0, marginTop: "0px" }}
                >
                  {capitalizeWord(currentPlaylist.title)}
                </h2>
                <button
                  className={styles.syncButton}
                  type="button"
                  onClick={handleRefresh}
                  disabled={hasRefreshed}
                >
                  <FontAwesomeIcon size="2x" icon={faSync} />
                </button>
              </div>
              <div>{`${currentPlaylist.source.toUpperCase()} PLAYLIST`}</div>
              <div>{`${currentPlaylist.total} Tracks`}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  marginTop: "auto"
                }}
              >
                <button
                  type="button"
                  onClick={handlePlayPlaylist}
                  className={styles.playlistPlayButton}
                  style={{
                    borderRadius: "50%",
                    background:
                      "linear-gradient(330deg, rgba(255,187,17,1) 0%, rgba(255,200,66,1) 70%, rgba(255,255,255,1) 100%)",
                    color: "#192124",
                    marginLeft: "0",
                    cursor: "pointer"
                  }}
                >
                  <FontAwesomeIcon icon={faPlay} size="2x" />
                </button>
                <div>Last synced: {timeSince(currentPlaylist.dateSynced)} </div>
              </div>
            </div>
          </div>

          <div className={`${styles.libraryWrapper}`}>
            <TrackList
              tracks={tracks.slice(0, numShowTracks)}
              currentTrackID={currentTrackID}
              isPlaying={isPlaying}
              handlePlay={dispatchPlayTrack}
            />
            {isLoading && <LoadingSpinner />}
          </div>
        </div>
      </div>
    )
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

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export default PlaylistTracklist;
