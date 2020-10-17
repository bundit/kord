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
import LoadingSpinner from "./loading-spinner";
import PageHeader from "./page-header";
import TrackList from "./track-list";
import styles from "../styles/artist-page.module.scss";

const ArtistPage = () => {
  const dispatch = useDispatch();
  const scrollContainer = useRef(null);
  const { source, artistId, artistName } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [artist, setArtist] = useState({});
  const [artistTracks, setArtistTracks] = useState(
    getArtistTracksInitialState(source)
  );
  const isPlaying = useSelector(state => state.player.isPlaying);
  const context = useSelector(state => state.player.context);
  const currentTrackId = useSelector(state => state.player.currentTrack.id);
  const { topTracks, allTracks } = artistTracks;
  const thisArtistIsPlaying = // eslint-disable-next-line
    context.source === source && context.id == artistId && isPlaying;

  const loadMoreTracks = useLoadMoreTracksCallback(
    source,
    artistId,
    artistName,
    artistTracks,
    setArtistTracks,
    isLoading,
    setIsLoading
  );

  useFetchArtistOnMount(source, artistId, artistName, setArtist);
  useFetchArtistTracksOnMount(
    source,
    artistId,
    loadMoreTracks,
    setArtistTracks
  );

  useCacheArtist(source, artistId, artist, artistTracks);
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

  function handlePlayPauseArtist() {
    if (thisArtistIsPlaying) {
      dispatch(pause());
    } else {
      if (context.id === artistId) {
        dispatch(play());
      } else {
        handlePlayTrack(0, "topTracks");
      }
    }
  }

  return (
    <div
      className={styles.pageWrapper}
      ref={scrollContainer}
      onScroll={loadTracksOnScroll}
    >
      <div className={styles.pageSectionWrapper}>
        <PageHeader
          imgSrc={getImgUrl(artist, "lg")}
          title={artistName}
          titleHref={artist.url}
          imgBorderRadius="50%"
          thisPageIsPlaying={thisArtistIsPlaying}
          handlePlayPause={handlePlayPauseArtist}
        >
          <div>{`${source.toUpperCase()} ARTIST PAGE`}</div>
          {artist.followers_count && (
            <div>{`${formatNumber(artist.followers_count)} Followers`}</div>
          )}
          {(artist.track_count || allTracks.total) && (
            <div>{` ${formatNumber(
              artist.track_count || allTracks.total
            )} Tracks`}</div>
          )}
        </PageHeader>

        <ArtistInfoSection artist={artist} />
        <div className={styles.trackSectionWrapper}>
          <TrackSection
            title={`${artistName}'s Top Tracks`}
            artistName={artistName}
            tracks={topTracks.tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            handlePlay={index => handlePlayTrack(index, "topTracks")}
            artistId={artistId}
          />

          <TrackSection
            title={`${
              source === "youtube" ? "" : "Other"
            } Tracks by ${artistName}`}
            artistName={artistName}
            tracks={allTracks.tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            handlePlay={index => handlePlayTrack(index, "allTracks")}
            artistId={artistId}
          />
          {isLoading && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
};

function getArtistTracksInitialState(source) {
  const tracksInitialState = {
    tracks: [],
    next: "start"
  };
  const emptyState = {
    tracks: [],
    next: null
  };

  return {
    topTracks: source === "youtube" ? emptyState : tracksInitialState,
    allTracks: tracksInitialState
  };
}

function useLoadMoreTracksCallback(
  source,
  artistId,
  artistName,
  artistTracks,
  setArtistTracks,
  isLoading,
  setIsLoading
) {
  const dispatch = useDispatch();

  return React.useCallback(() => {
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
  }, [
    artistId,
    artistName,
    artistTracks,
    dispatch,
    isLoading,
    setArtistTracks,
    setIsLoading,
    source
  ]);
}

function useFetchArtistOnMount(source, artistId, artistName, setArtist) {
  const dispatch = useDispatch();

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
    } // eslint-disable-next-line
  }, []);
}

function useFetchArtistTracksOnMount(
  source,
  artistId,
  loadMoreTracks,
  setArtistTracks
) {
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
}

function useCacheArtist(source, artistId, artist, artistTracks) {
  useEffect(() => {
    if (Object.keys(artist).length) {
      cacheValue(`Artist:${artistId}:${source}`, artist);
    }
  }, [artist, artistId, source]);

  useEffect(() => {
    cacheValue(`Artist:${artistId}:${source}:Tracks`, artistTracks);
  }, [artistId, artistTracks, source]);
}

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

function ArtistInfoSection({ artist }) {
  const [showFullBio, setShowFullBio] = useState(false);
  const { bio, fullBio, similar, tags } = artist;

  function toggleShowFullBio() {
    setShowFullBio(!showFullBio);
  }

  const hasBio = bio && !!bio.length;
  const hasTags = tags && !!tags.length;
  const hasSimilar = similar && !!similar.length;
  const hasSimilarOrTags = hasTags || hasSimilar;

  return (
    <>
      {hasBio && (
        <div className={styles.artistContentSection}>
          <h2 className={styles.artistSubHeader}>About the Artist</h2>
          <div>
            {showFullBio ? fullBio : bio}
            {!!fullBio && (
              <button
                onClick={toggleShowFullBio}
                className={styles.showMoreLessBioButton}
              >
                {showFullBio ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>
      )}
      {hasSimilarOrTags && (
        <div className={styles.artistTagsAndSimilarSection}>
          {hasTags && (
            <span>
              <h2 className={styles.artistSubHeader}>Tags</h2>
              <span>
                {tags.map((tag, i, tags) => (
                  <span key={tag}>{`${tag}${
                    i < tags.length - 1 ? ", " : ""
                  }`}</span>
                ))}
              </span>
            </span>
          )}
          {hasSimilar && (
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
          )}
        </div>
      )}
    </>
  );
}

function TrackSection({
  title,
  artistName,
  tracks,
  currentTrackId,
  isPlaying,
  handlePlay,
  artistId
}) {
  if (!tracks || !tracks.length) {
    return null;
  }

  return (
    <>
      <h2 className={styles.trackSectionTitle}>{decodeURIComponent(title)}</h2>
      <TrackList
        tracks={tracks}
        currentTrackID={currentTrackId}
        isPlaying={isPlaying}
        handlePlay={handlePlay}
        playlistId={artistId}
        search
      />
    </>
  );
}

export default ArtistPage;
