import * as Sentry from "@sentry/react";
import React, { MutableRefObject, ReactElement } from "react";
import ReactYoutube, { YouTubePlayerProps } from "react-player/youtube";
import { useDispatch, useSelector } from "react-redux";

import { setTrackUnstreamable } from "../redux/actions/libraryActions";
import {
  nextTrack,
  pause,
  play,
  setDuration
} from "../redux/actions/playerActions";

import ReactPlayer from "react-player";
import styles from "../styles/player.module.scss";
import { Track } from "../types/global";
import { getTrackExternalLink } from "../utils/libraryUtils";

type YoutubeInstanceRef = MutableRefObject<ReactPlayer>;

interface YoutubePlayerProps {
  volume: number;
  forwardRef: YoutubeInstanceRef;
  onEnd: YouTubePlayerProps["onEnded"];
  playerIsExpanded: boolean;
}

function YoutubePlayer({
  volume,
  forwardRef,
  onEnd,
  playerIsExpanded
}: YoutubePlayerProps): ReactElement {
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const current = useSelector((state) => state.player.currentTrack);
  const showYoutubePlayer = useSelector(
    (state) => state.player.showYoutubePlayer
  );
  const youtubeIsPlaying = current.source === "youtube" && isPlaying;

  const dispatch = useDispatch();

  useStartAtBeginningOnTrackChange(current, forwardRef);
  useSyncPlayPause(youtubeIsPlaying, current, forwardRef);
  useSyncVolume(volume, forwardRef);

  function handleYoutubeReady(e) {
    // forwardRef.current = e.target;
    // forwardRef.current.setVolume(volume * 100);
    // forwardRef.current.
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

  function handlePlayPause() {
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  }

  function getYoutubeContainerClassNames() {
    const youtubeActive = current.source === "youtube";

    return `${styles.youtubeContainer} ${
      youtubeActive && styles.youtubeActive
    } ${youtubeIsPlaying && styles.youtubeIsPlaying} ${
      playerIsExpanded && youtubeActive
        ? styles.youtubeExpanded
        : styles.youtubeNotExpanded
    } ${!showYoutubePlayer && styles.hiddenYoutubePlayer}`;
  }

  return (
    <div onClick={handlePlayPause} className={getYoutubeContainerClassNames()}>
      {current.source === "youtube" && current.id && (
        <ReactYoutube
          ref={forwardRef}
          url={getTrackExternalLink(current)}
          videoId={current.id}
          config={{
            playerVars: {
              controls: 0,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              autoplay: youtubeIsPlaying ? 1 : 0
            }
          }}
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
          onReady={handleYoutubeReady}
          onEnded={onEnd}
          onError={handleYoutubePlayerError}
          onStateChange={handleStateChange}
          volume={volume}
          playing={isPlaying}
        />
      )}
    </div>
  );
}

// Make sure that video starts at 0:00 on track change and not cached seek time
function useStartAtBeginningOnTrackChange(
  currentTrack: Track,
  youtubePlayer: YoutubeInstanceRef
) {
  React.useEffect(() => {
    if (currentTrack.source === "youtube" && youtubePlayer.current) {
      youtubePlayer.current.seekTo(0);
    }
  }, [currentTrack, youtubePlayer]);
}

export default YoutubePlayer;
