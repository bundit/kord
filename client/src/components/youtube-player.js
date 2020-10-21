import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as Sentry from "@sentry/react";
import YouTube from "react-youtube";

import { nextTrack, setDuration } from "../redux/actions/playerActions";
import { setTrackUnstreamable } from "../redux/actions/libraryActions";
import styles from "../styles/player.module.scss";

function YoutubePlayer({ volume, forwardRef, onEnd, playerIsExpanded }) {
  const isPlaying = useSelector(state => state.player.isPlaying);
  const current = useSelector(state => state.player.currentTrack);
  const youtubeIsPlaying = current.source === "youtube" && isPlaying;

  const dispatch = useDispatch();

  useStartAtBeginningOnTrackChange(current, forwardRef);
  useSyncPlayPause(youtubeIsPlaying, current, forwardRef);
  useSyncVolume(volume, forwardRef);

  function handleYoutubeReady(e) {
    forwardRef.current = e.target;
    forwardRef.current.setVolume(volume * 100);
  }

  function handleYoutubePlayerError(e) {
    console.error(`Youtube player error ${e.data}`);
    if (e.data === 2) {
      Sentry.captureMessage(
        `Invalid youtube iframe parameters. VideoId: ${current.id} PlaylistItemId: ${current.playlistItemId}`
      );
    }
    const errorCodes = [5, 100, 101, 150];
    if (errorCodes.includes(e.data)) {
      dispatch(setTrackUnstreamable(current.id));
      dispatch(nextTrack());
    }
  }

  function handleStateChange(e) {
    const duration = e.target.getDuration();

    if (duration && isNaN(current.duration) && current.source === "youtube") {
      dispatch(setDuration(duration));
    }
  }

  function getYoutubeContainerClassNames() {
    const youtubeActive = current.source === "youtube";

    return `${styles.youtubeContainer} ${youtubeActive &&
      styles.youtubeActive} ${youtubeIsPlaying &&
      styles.youtubeIsPlaying} ${playerIsExpanded &&
      youtubeActive &&
      styles.youtubeExpanded}`;
  }

  return (
    <YouTube
      videoId={current.source === "youtube" ? current.id : null}
      opts={{
        height: "100%",
        width: "100%",
        playerVars: {
          controls: 0,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          autoplay: youtubeIsPlaying ? 1 : 0
        }
      }}
      containerClassName={getYoutubeContainerClassNames()}
      onReady={handleYoutubeReady}
      onEnd={onEnd}
      onError={handleYoutubePlayerError}
      onStateChange={handleStateChange}
    />
  );
}

// Make sure that video starts at 0:00 on track change and not cached seek time
function useStartAtBeginningOnTrackChange(currentTrack, youtubePlayer) {
  React.useEffect(() => {
    if (currentTrack.source === "youtube" && youtubePlayer.current) {
      youtubePlayer.current.seekTo(0);
    }
  }, [currentTrack, youtubePlayer]);
}

function useSyncPlayPause(isPlaying, current, youtubePlayer) {
  React.useEffect(() => {
    if (!youtubePlayer.current) {
      return;
    }

    if (current.source !== "youtube") {
      youtubePlayer.current.stopVideo();
      return;
    }

    if (isPlaying) {
      youtubePlayer.current.playVideo();
    } else {
      youtubePlayer.current.pauseVideo();
    }
  }, [current, youtubePlayer, isPlaying]);
}

function useSyncVolume(volume, youtubePlayer) {
  React.useEffect(() => {
    if (youtubePlayer.current) {
      youtubePlayer.current.setVolume(volume * 100);
    }
  }, [youtubePlayer, volume]);
}

export default YoutubePlayer;
