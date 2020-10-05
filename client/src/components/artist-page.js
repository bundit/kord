import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { forceCheck } from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import React, { useRef, useState, useEffect } from "react";

import { cacheValue, loadCachedValue } from "../utils/sessionStorage";
import { capitalizeWord, formatNumber } from "../utils/formattingHelpers";
import {
  fetchArtist,
  fetchArtistTracks,
  fetchMoreArtistTracks
} from "../redux/actions/searchActions";
import { fetchArtistInfo } from "../redux/actions/lastFmActions";
import { getImgUrl } from "../utils/getImgUrl";
import { pause, play, playTrack } from "../redux/actions/playerActions";
import LargePlayPauseButton from "./large-play-pause-button";
import LoadingSpinner from "./loading-spinner";
import TrackList from "./track-list";
import styles from "../styles/library.module.css";

const tracksInitialState = {
  tracks: [],
  next: "start"
};

const artistTracksInitialState = {
  topTracks: tracksInitialState,
  allTracks: tracksInitialState
};

const youtubeInitialState = {
  topTracks: { tracks: [] },
  allTracks: tracksInitialState
};

const ArtistPage = () => {
  const dispatch = useDispatch();
  const scrollContainer = useRef(null);
  const { source, artistId, artistName } = useParams();
  const [showFullBio, setShowFullBio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const [artistTracks, setArtistTracks] = useState(
    source === "youtube" ? youtubeInitialState : artistTracksInitialState
  );
  const isPlaying = useSelector(state => state.player.isPlaying);
  const context = useSelector(state => state.player.context);
  const currentTrackId = useSelector(state => state.player.currentTrack.id);

  useEffect(() => {
    const cachedArtist = loadCachedValue(`Artist:${artistId}:${source}`);

    if (!cachedArtist || !Object.keys(cachedArtist).length) {
      dispatch(fetchArtist(artistId, source)).then(artist => {
        fetchArtistInfo(artistName).then(artistInfo => {
          setArtist({
            ...artist,
            ...artistInfo
          });
        });
      });
    } else {
      setArtist(cachedArtist);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const cachedTracks = loadCachedValue(`Artist:${artistId}:${source}:Tracks`);

    if (!cachedTracks) {
      loadMoreTracks();
      return;
    }

    const { topTracks, allTracks } = cachedTracks;

    if (topTracks.next === "start" && allTracks.next === "start") {
      loadMoreTracks();
    } else {
      setArtistTracks(cachedTracks);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (Object.keys(artist).length) {
      cacheValue(`Artist:${artistId}:${source}`, artist);
    }
  }, [artist, artistId, source]);

  useEffect(() => {
    cacheValue(`Artist:${artistId}:${source}:Tracks`, artistTracks);
  }, [artistId, artistTracks, source]);

  const loadMoreTracks = React.useCallback(() => {
    const { topTracks, allTracks } = artistTracks;

    const isLoadingOrNoMoreTracks =
      isLoading || (!topTracks.next && !allTracks.next);

    if (isLoadingOrNoMoreTracks) {
      return;
    }

    const type = topTracks.next ? "topTracks" : "allTracks";

    setIsLoading(true);

    setTimeout(() => {
      let request;

      const nextHref = artistTracks[type].next;

      if (nextHref === "start") {
        request = dispatch(
          fetchArtistTracks(artistId, source, type, artistName)
        );
      } else {
        request = dispatch(fetchMoreArtistTracks(nextHref, source));
      }

      request
        .then(({ tracks, next, total }) => {
          if (type === "allTracks") {
            tracks = tracks.filter(track =>
              topTracks.tracks.every(
                topTrack =>
                  topTrack.id !== track.id && topTrack.title !== track.title
              )
            );
          }
          setArtistTracks(artistTracks => ({
            ...artistTracks,
            [type]: {
              tracks: [...artistTracks[type].tracks, ...tracks],
              next,

              total
            }
          }));
        })
        .finally(() => setIsLoading(false));
    }, 500);
  }, [artistId, artistName, artistTracks, dispatch, isLoading, source]);

  const loadTracksOnScroll = useLoadTracksOnScroll(loadMoreTracks);

  function handlePlayTrack(index, category) {
    const { topTracks, allTracks } = artistTracks;
    const context = {
      source: source,
      id: artistId,
      search: true,
      title: capitalizeWord(artist.name)
    };

    if (category === "topTracks") {
      if (topTracks.next) {
        dispatch(playTrack(index, topTracks.tracks, topTracks.next, context));
      } else if (allTracks.next === "start") {
        dispatch(
          fetchArtistTracks(artistId, source, "allTracks", artistName)
        ).then(({ tracks, next }) => {
          const tracklist = [...topTracks.tracks, ...tracks];

          dispatch(playTrack(index, tracklist, next, context));
        });
      } else {
        const tracklist = [...topTracks.tracks, ...allTracks.tracks];

        dispatch(playTrack(index, tracklist, allTracks.next, context));
      }
    } else {
      index = topTracks.tracks.length + index;

      const tracklist = [...topTracks.tracks, ...allTracks.tracks];

      dispatch(playTrack(index, tracklist, allTracks.next, context));
    }
  }

  function handlePlayArtist() {
    if (context.id === artistId) {
      dispatch(play());
    } else {
      handlePlayTrack(0, "topTracks");
    }
  }

  function handlePauseArtist() {
    dispatch(pause());
  }

  function toggleShowFullBio() {
    setShowFullBio(!showFullBio);
  }

  const { topTracks, allTracks } = artistTracks;
  const thisArtistIsPlaying = // eslint-disable-next-line
    context.source === source && context.id == artistId && isPlaying;

  return (
    <div
      className={styles.pageWrapper}
      ref={scrollContainer}
      onScroll={loadTracksOnScroll}
    >
      <div
        className={styles.listContainer}
        style={{ backgroundColor: "inherit" }}
      >
        <div className={styles.playlistHeader} style={{ display: "flex" }}>
          <div
            className={styles.playlistImageWrap}
            style={{
              width: "200px",
              height: "200px",
              paddingTop: 0,
              marginLeft: "20px",
              borderRadius: "50%"
            }}
          >
            <img src={getImgUrl(artist, "lg")} alt="artist-profile-pic" />
          </div>

          <div className={styles.listTitleWrapper}>
            <h2
              className={styles.listTitle}
              style={{ paddingLeft: 0, marginTop: "0px" }}
            >
              <a href={artist.url} target="_blank" rel="noopener noreferrer">
                {capitalizeWord(decodeURIComponent(artistName))}
                <span style={{ marginLeft: "5px" }}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
                </span>
              </a>
            </h2>

            <div>{`${source.toUpperCase()} ARTIST PAGE`}</div>
            {artist.followers_count && (
              <div>{`${formatNumber(artist.followers_count)} Followers`}</div>
            )}
            {(artist.track_count || allTracks.total) && (
              <div>{` ${formatNumber(
                artist.track_count || allTracks.total
              )} Tracks`}</div>
            )}

            <div style={{ marginTop: "auto" }}>
              <LargePlayPauseButton
                isCurrentlyPlaying={thisArtistIsPlaying}
                handlePlay={handlePlayArtist}
                handlePause={handlePauseArtist}
              />
            </div>
          </div>
        </div>
        {artist.bio && artist.bio.length && (
          <div className={styles.libraryWrapper} style={{ color: "#bbb" }}>
            <h2 className={styles.artistSubHeader}>About the Artist</h2>
            <div>
              {showFullBio ? artist.fullBio : artist.bio}
              {artist.fullBio ? (
                <button
                  onClick={toggleShowFullBio}
                  style={{ color: "#6373c8", outline: "none" }}
                >
                  {showFullBio ? "Show less" : "Show more"}
                </button>
              ) : null}
            </div>
          </div>
        )}
        <div
          className={styles.libraryWrapper}
          style={{
            display: "grid",
            gridTemplateColumns: "50% 50%",
            color: "#bbb"
          }}
        >
          {artist.tags && artist.tags.length ? (
            <span>
              <h2 className={styles.artistSubHeader}>Tags</h2>
              <span>
                {artist.tags.map((tag, i, tags) => (
                  <span key={tag}>{`${tag}${
                    i < tags.length - 1 ? ", " : ""
                  }`}</span>
                ))}
              </span>
            </span>
          ) : null}
          {artist.similar && artist.similar.length ? (
            <span>
              <h2 className={styles.artistSubHeader}>Similar Artists</h2>
              <span>
                {artist.similar.map((otherArtist, i, similar) => (
                  <span key={otherArtist}>{`${otherArtist}${
                    i < similar.length - 1 ? ", " : ""
                  }`}</span>
                ))}
              </span>
            </span>
          ) : null}
        </div>
        <div className={styles.libraryWrapper}>
          {topTracks.tracks.length ? (
            <>
              <h2 className={styles.trackSectionTitle}>{`${decodeURIComponent(
                artistName
              )}'s Top Tracks`}</h2>
              <TrackList
                tracks={topTracks.tracks}
                currentTrackID={currentTrackId}
                isPlaying={isPlaying}
                handlePlay={index => handlePlayTrack(index, "topTracks")}
                playlistId={artistId}
                search
              />
            </>
          ) : null}
          {allTracks.tracks.length ? (
            <>
              <h2 className={styles.trackSectionTitle}>{`${
                source === "youtube" ? "" : "Other"
              } Tracks by ${decodeURIComponent(artistName)}`}</h2>
              <TrackList
                tracks={allTracks.tracks}
                currentTrackID={currentTrackId}
                isPlaying={isPlaying}
                handlePlay={index => handlePlayTrack(index, "allTracks")}
                playlistId={artistId}
                search
              />
            </>
          ) : null}
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
};

function useLoadTracksOnScroll(loadMoreTracks) {
  return function(e) {
    forceCheck();
    const eScrollTop = e.target.scrollTop;
    const eHeight = e.target.getBoundingClientRect().height;
    const eScrollHeight = e.target.scrollHeight - 10;
    if (eScrollTop + eHeight >= eScrollHeight) {
      loadMoreTracks();
    }
  };
}

export default ArtistPage;
