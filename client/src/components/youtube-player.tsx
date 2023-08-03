import * as Sentry from "@sentry/react";
import React, { MutableRefObject, ReactElement } from "react";
import ReactYoutube, { YouTubePlayerProps } from "react-player/youtube";
import { useDispatch, useSelector } from "react-redux";

import { setTrackUnstreamable } from "../redux/actions/libraryActions";
import { nextTrack, pause, play } from "../redux/actions/playerActions";

import classNames from "classnames";
import { RootState } from "../redux/types";
import styles from "../styles/player.module.scss";
import { Track } from "../types/global";
import { getTrackExternalLink } from "../utils/libraryUtils";

type YoutubeInstanceRef = MutableRefObject<ReactYoutube>;

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
  const isPlaying = useSelector<RootState, boolean>(
    (state) => state.player.isPlaying
  );
  const current = useSelector<RootState, Track>(
    (state) => state.player.currentTrack
  );
  const showYoutubePlayer = useSelector<RootState, boolean>(
    (state) => state.player.showYoutubePlayer
  );
  const isYoutubeActive = current.source === "youtube";
  const isYoutubeActiveAndPlaying = current.source === "youtube" && isPlaying;
  const isYoutubeActiveAndPlayerExpanded = playerIsExpanded && isYoutubeActive;

  const dispatch = useDispatch();

  useStartAtBeginningOnTrackChange(current, forwardRef);

  function handleYoutubePlayerError(e: YT.OnErrorEvent) {
    console.error(`Youtube player error ${e.data}`);
    if (e.data === 2) {
      Sentry.captureMessage(
        `Invalid youtube iframe parameters. VideoId: ${current.id} PlaylistItemId: ${current.playlistItemId}`
      );
    }
    const errorCodes = [5, 100, 101, 150];
    if (errorCodes.includes(e.data)) {
      // @ts-ignore
      // TODO: Add redux action types
      dispatch(setTrackUnstreamable(current.id));
      // @ts-ignore
      dispatch(nextTrack());
    }
  }

  function handlePlayPause() {
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  }

  return (
    <div
      onClick={handlePlayPause}
      className={classNames(styles.youtubeContainer, {
        [styles.youtubeActive]: isYoutubeActive,
        [styles.youtubeExpanded]: isYoutubeActiveAndPlayerExpanded,
        [styles.youtubeNotExpanded]: !isYoutubeActiveAndPlayerExpanded,
        [styles.hiddenYoutubePlayer]: !showYoutubePlayer
      })}
    >
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
              autoplay: isYoutubeActiveAndPlaying ? 1 : 0
            }
          }}
          height={"100%"}
          width={"100%"}
          onEnded={onEnd}
          onError={handleYoutubePlayerError}
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
    if (currentTrack.source === "youtube" && youtubePlayer?.current) {
      youtubePlayer.current.seekTo(0);
    }
  }, [currentTrack, youtubePlayer]);
}

export default YoutubePlayer;
