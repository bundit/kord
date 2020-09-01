import { useDispatch } from "react-redux";
import React from "react";
import YouTube from "react-youtube";
import * as Sentry from "@sentry/react";

import { nextTrack } from "../redux/actions/playerActions";
import { setTrackUnstreamable } from "../redux/actions/libraryActions";
import styles from "../styles/player.module.css";

function YoutubePlayer({ isPlaying, current, volume, forwardRef, onEnd }) {
  const dispatch = useDispatch();
  const isPlayingStyle = `${isPlaying &&
    current.source === "youtube" &&
    styles.youtubeIsPlaying}`;

  useSyncPlayPause(isPlaying, current, forwardRef);
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

  return (
    <YouTube
      videoId={current.source === "youtube" ? current.id : null}
      opts={{
        height: "56",
        width: "100",
        playerVars: {
          controls: 0,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          autoplay: isPlaying ? 1 : 0
        }
      }}
      containerClassName={`${styles.youtubeContainer} ${isPlayingStyle}`}
      onReady={handleYoutubeReady}
      onEnd={onEnd}
      onError={handleYoutubePlayerError}
    />
  );
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
  }, [current.source, youtubePlayer, isPlaying]);
}

function useSyncVolume(volume, youtubePlayer) {
  React.useEffect(() => {
    if (youtubePlayer.current) {
      youtubePlayer.current.setVolume(volume * 100);
    }
  }, [youtubePlayer, volume]);
}

export default YoutubePlayer;
