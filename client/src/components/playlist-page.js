import { forceCheck } from "react-lazyload";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import React, { useRef, useState, useEffect, useCallback } from "react";

import { capitalizeWord } from "../utils/formattingHelpers";
import {
  clearPlaylistTracks,
  loadLikes,
  loadPlaylistTracks,
  toggleStarPlaylist
} from "../redux/actions/libraryActions";
import { getImgUrl } from "../utils/getImgUrl";
import {
  pause,
  play,
  playPlaylist,
  playTrack
} from "../redux/actions/playerActions";
import { timeSince } from "../utils/dateHelpers";
import { usePrevious } from "../utils/hooks";
import LoadingSpinner from "./loading-spinner";
import PageHeader from "./page-header";
import TrackList from "./track-list";
import styles from "../styles/layout.module.scss";

const playlistIncrementAmount = 25;

function PlaylistPage() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const scrollContainer = useRef(null);
  const playlists = useSelector(state => state.library.playlists);
  const isPlaying = useSelector(state => state.player.isPlaying);
  const context = useSelector(state => state.player.context);
  const [numShowTracks, setNumShowTracks] = useState(playlistIncrementAmount);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { source, id, title } = useParams();

  const thisPlaylistIsPlaying = // eslint-disable-next-line
    context.source === source && context.id == id && isPlaying;
  // eslint-disable-next-line
  const playlistIndex = playlists[source].findIndex(p => p.id == id);
  const currentPlaylist = playlists[source][playlistIndex] || {};
  const tracks = currentPlaylist.tracks || [];

  const loadMoreTracks = useLoadMoreTracksCallback(
    currentPlaylist,
    isLoading,
    setIsLoading,
    id,
    tracks,
    source,
    hasRefreshed,
    setHasRefreshed
  );

  const loadTracksOnScroll = useLoadTracksOnScroll(
    tracks,
    numShowTracks,
    showMoreTracks,
    loadMoreTracks
  );

  useResetOnPlaylistChange(currentPlaylist, setNumShowTracks, scrollContainer);
  useLoadTracksIfEmpty(tracks, loadMoreTracks, hasRefreshed, setHasRefreshed);

  function showMoreTracks() {
    setNumShowTracks(numShowTracks + playlistIncrementAmount);
  }

  function handlePlayTrack(index) {
    const context = {
      source: tracks[index].source,
      id: id,
      title: capitalizeWord(title)
    };
    dispatch(playTrack(index, tracks, currentPlaylist.next, context));
  }

  function handleRefresh() {
    dispatch(clearPlaylistTracks(source, currentPlaylist.id));
  }

  function handlePlayPausePlaylist(e) {
    if (thisPlaylistIsPlaying) {
      dispatch(pause());
    } else {
      if (context.id === id && context.source === source) {
        dispatch(play());
      } else {
        dispatch(playPlaylist(currentPlaylist));
      }
    }

    e.stopPropagation();
    e.preventDefault();
  }

  function handleToggleStarPlaylist() {
    dispatch(toggleStarPlaylist(id, source)).catch(e =>
      alert.error("Network Error")
    );
  }

  if (isEmptyObject(currentPlaylist)) {
    return null;
  }

  return (
    <div
      className={styles.pageWrapper}
      ref={scrollContainer}
      onScroll={loadTracksOnScroll}
    >
      <div className={styles.pageSectionWrapper}>
        <PageHeader
          imgSrc={getImgUrl(currentPlaylist, "lg")}
          title={title}
          titleHref={getPlaylistLink(source, currentPlaylist)}
          imgBorderRadius="7px"
          isStarred={currentPlaylist.isStarred}
          handleStar={handleToggleStarPlaylist}
          hasRefreshed={hasRefreshed}
          handleRefresh={handleRefresh}
          thisPageIsPlaying={thisPlaylistIsPlaying}
          handlePlayPause={handlePlayPausePlaylist}
          canPlay={tracks && !!tracks.length}
          lastSynced={isLoading ? "..." : timeSince(currentPlaylist.dateSynced)}
        >
          <div>{`${currentPlaylist.source.toUpperCase()} PLAYLIST`}</div>
          <div>{`${currentPlaylist.total} Tracks`}</div>
        </PageHeader>

        <div className={`${styles.contentWrapper}`}>
          <TrackList
            tracks={tracks.slice(0, numShowTracks)}
            handlePlay={handlePlayTrack}
            playlistId={id}
          />
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
}

function useLoadMoreTracksCallback(
  playlist,
  isLoading,
  setIsLoading,
  id,
  tracks,
  source,
  hasRefreshed,
  setHasRefreshed
) {
  const dispatch = useDispatch();
  const { next, total } = playlist;

  return useCallback(() => {
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
            setHasRefreshed(false);
          }
        })
        .catch(e => {
          alert.error("Error loading tracks");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500);
  }, [
    isLoading,
    next,
    total,
    setIsLoading,
    id,
    tracks.length,
    dispatch,
    source,
    hasRefreshed,
    setHasRefreshed
  ]);
}

function useResetOnPlaylistChange(
  currentPlaylist,
  setNumShowTracks,
  scrollContainer
) {
  const prevTracklistId = usePrevious(currentPlaylist.id);

  useEffect(() => {
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
    forceCheck();
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

function useLoadTracksIfEmpty(
  tracks,
  handleLoadMoreTracks,
  hasRefreshed,
  setHasRefreshed
) {
  useEffect(() => {
    if (!tracks.length && !hasRefreshed) {
      handleLoadMoreTracks();
      setHasRefreshed(true);
    }
  }, [tracks, handleLoadMoreTracks, hasRefreshed, setHasRefreshed]);
}

function getPlaylistLink(source, playlist) {
  if (source === "soundcloud") {
    return playlist.externalUrl;
  } else if (source === "spotify") {
    if (playlist.id === "likes") {
      return "https://open.spotify.com/collection/tracks";
    } else {
      return `https://open.spotify.com/playlist/${playlist.id}`;
    }
  } else if (source === "youtube") {
    return `https://www.youtube.com/playlist?list=${playlist.id}`;
  }
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export default PlaylistPage;
