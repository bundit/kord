import { CSSTransition } from "react-transition-group";
import { connect, useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import ReactHowler from "react-howler";
import raf from "raf";

import { keepWithinVolumeRange } from "../utils/formattingHelpers";
import {
  nextTrack,
  pause,
  play,
  prevTrack,
  setMuted,
  setSeek,
  setVolume
} from "../redux/actions/playerActions";
import { setTrackUnstreamable } from "../redux/actions/libraryActions";
import {
  toggleKeyboardControlsMenu,
  toggleUserQueue
} from "../redux/actions/userActions";
import {
  useDetectMediaSession,
  useKeyControls,
  usePauseIfSdkNotReady,
  useRenderSeekPosition,
  useSetDocumentTitle,
  useSetDurationOnTrackChange
} from "../utils/hooks";
import ExpandedPlayer from "./expanded-player";
import MinifiedPlayer from "./minified-player";
import SpotifyPlayer from "./spotify-player";
import YoutubePlayer from "./youtube-player";
import miniPlayerSlide from "../styles/miniPlayerSlide.module.css";
import slideTransition from "../styles/slide.module.css";

export const Player = ({
  current,
  isPlaying,
  volume,
  isMuted,
  seek,
  duration
}) => {
  const [isSpotifySdkReady, setIsSpotifySdkReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userSeekPos, setUserSeekPos] = useState(0);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const [userVolumeValue, setUserVolumeValue] = useState(volume);
  const [isUserSettingVolume, setIsUserSettingVolume] = useState(false);
  volume = isMuted ? 0 : volume;

  const theRaf = useRef(null);
  const soundcloudPlayer = useRef(null);
  const spotifyPlayer = useRef(null);
  const youtubePlayer = useRef(null);
  const alert = useAlert();
  const dispatch = useDispatch();
  const seekAmount = useSelector(state => state.player.seekAmount) || 15;

  useKeyControls(handleKeyControls);
  useSetDurationOnTrackChange(current);
  usePauseIfSdkNotReady(current, isPlaying, isSpotifySdkReady);

  const renderSeekPos = React.useCallback(() => {
    let currentPos;
    try {
      if (current.source === "soundcloud") {
        currentPos = soundcloudPlayer.current.seek();
      } else if (current.source === "spotify") {
        currentPos = spotifyPlayer.current.seek() / 1000;
      } else if (current.source === "youtube") {
        currentPos = youtubePlayer.current.getCurrentTime();
      } else return raf.cancel(theRaf.current);
    } catch (e) {
      return raf.cancel(theRaf.current);
    }

    // We need to check if seek is a number because there is a race condition in howler
    // where it will return the howler object if there is a playLock on it.
    if (typeof currentPos === "number") {
      currentPos = parseFloat(currentPos.toFixed(1));
      dispatch(setSeek(currentPos));
    }

    theRaf.current = raf(renderSeekPos);
  }, [current, dispatch]);

  useRenderSeekPosition(current, theRaf, renderSeekPos, isPlaying);
  useDetectMediaSession();
  useSetDocumentTitle();

  function handlePlay() {
    dispatch(play());
  }

  function handlePause() {
    dispatch(pause());
  }

  function handlePlayPause(e) {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }

    if (e) {
      e.stopPropagation();
    }
  }

  function handleSpotifyReady() {
    setIsSpotifySdkReady(true);
  }

  function handleOnEnd() {
    dispatch(nextTrack());
  }

  function toggleExpand(e) {
    setIsExpanded(!isExpanded);
    e.stopPropagation();
  }

  // This gets fired when the user is manually seeking using the slider
  function handleOnChangeUserSeek(e) {
    if (isUserSeeking) {
      setUserSeekPos(e.target.value);
    }
  }

  function handlePrevTrack() {
    if (seek < 5) {
      dispatch(prevTrack());
    } else handleSeek(0);
  }

  function handleNextTrack() {
    dispatch(nextTrack());
  }

  function handleSeek(seconds) {
    raf.cancel(theRaf.current);

    if (seconds < 0) seconds = 0;
    if (seconds > duration) seconds = duration;

    if (current.source === "soundcloud") {
      soundcloudPlayer.current.seek(seconds);
      dispatch(setSeek(seconds));
    }

    if (current.source === "spotify") {
      spotifyPlayer.current.seek(seconds * 1000);
    }

    if (current.source === "youtube") {
      youtubePlayer.current.seekTo(seconds);
    }

    dispatch(setSeek(seconds));

    setTimeout(() => renderSeekPos(), 300);
  }

  function handleToggleMute() {
    dispatch(setMuted(!isMuted));
  }

  function handleToggleQueue() {
    dispatch(toggleUserQueue());
  }

  function handleToggleControls() {
    dispatch(toggleKeyboardControlsMenu());
  }

  // eslint-disable-next-line
  function handleKeyControls(key, shiftPressed) {
    switch (key) {
      case " ": {
        return handlePlayPause();
      }
      case "ArrowLeft": {
        return handleSeek(seek - seekAmount);
      }
      case "ArrowRight": {
        return handleSeek(seek + seekAmount);
      }
      case "ArrowUp": {
        if (shiftPressed) {
          const volumeUp = keepWithinVolumeRange(volume + 0.1);
          dispatch(setVolume(volumeUp));
        }
        return;
      }
      case "ArrowDown": {
        if (shiftPressed) {
          const volumeDown = keepWithinVolumeRange(volume - 0.1);
          dispatch(setVolume(volumeDown));
        }
        return;
      }
      case "m": {
        return handleToggleMute();
      }
      case "q": {
        return handleToggleQueue();
      }
      case "h": {
        return handleToggleControls();
      }
      default: {
        if (key >= 1 || key <= 9) {
          handleSeek(Math.floor(duration * (key / 10)));
        }
        return;
      }
    }
  }

  function handleMouseDownSeek() {
    setIsUserSeeking(true);
  }

  function handleMouseUpSeek() {
    const newSeekPos = Number(userSeekPos);

    handleSeek(newSeekPos);
    setIsUserSeeking(false);
  }

  function handleOnChangeVolume(e) {
    if (isUserSettingVolume) {
      setUserVolumeValue(e.target.value);
    }
  }

  function handleMouseDownVolume() {
    dispatch(setMuted(false));
    setIsUserSettingVolume(true);
  }

  function handleMouseUpVolume() {
    const newVolumeValue = Number(userVolumeValue);

    dispatch(setVolume(newVolumeValue));
  }

  function handleSpotifyAccountError() {
    alert.error("Error: Spotify Premium Required");
  }

  function handleSoundcloudLoadError(id, err) {
    if (soundcloudPlayer.current) {
      if (err === 2 || err === 3) {
        soundcloudPlayer.current.initHowler();
      }
      if (err === 4) {
        // Not streamable
        dispatch(setTrackUnstreamable(current.id));
        handleNextTrack();
      }
    }
  }

  const KEY = process.env.REACT_APP_SC_KEY;

  return (
    <>
      <audio id="player" autoPlay loop>
        <source
          src="https://raw.githubusercontent.com/anars/blank-audio/master/10-minutes-of-silence.mp3"
          type="audio/mp3"
        />
      </audio>
      {current.source === "soundcloud" && (
        <ReactHowler
          src={`https://api.soundcloud.com/tracks/${current.id}/stream?client_id=${KEY}`}
          playing={isPlaying && current.source === "soundcloud"}
          onEnd={handleOnEnd}
          preload
          html5
          volume={volume}
          ref={soundcloudPlayer}
          onLoadError={handleSoundcloudLoadError}
        />
      )}
      <SpotifyPlayer
        forwardRef={spotifyPlayer}
        playerName="Kord Player - All your music in one place"
        isPlaying={isPlaying && current.source === "spotify"}
        onEnd={handleOnEnd}
        volume={volume}
        track={current}
        onReady={handleSpotifyReady}
        onAccountError={handleSpotifyAccountError}
        controls={{ play: handlePlay, pause: handlePause }}
      />
      <YoutubePlayer
        isPlaying={isPlaying}
        current={current}
        volume={volume}
        forwardRef={youtubePlayer}
        onEnd={handleOnEnd}
      />
      {/* Expanded music player */}
      <CSSTransition
        in={isExpanded}
        timeout={300}
        classNames={slideTransition}
        unmountOnExit
      >
        <ExpandedPlayer
          current={current}
          handleToggleExpand={toggleExpand}
          handlePlayPause={handlePlayPause}
          isPlaying={isPlaying}
          handleSeek={handleSeek}
          isUserSeeking={isUserSeeking}
          userSeekPos={Number(userSeekPos)}
          seek={seek}
          duration={duration}
          handleOnChangeUserSeek={handleOnChangeUserSeek}
          handleMouseDownSeek={handleMouseDownSeek}
          handleMouseUpSeek={handleMouseUpSeek}
          handlePrev={handlePrevTrack}
          handleNext={handleNextTrack}
        />
      </CSSTransition>
      {/* Mini Player */}
      <CSSTransition
        in={!isExpanded}
        timeout={500}
        classNames={miniPlayerSlide}
        unmountOnExit
      >
        <MinifiedPlayer
          current={current}
          handleToggleExpand={toggleExpand}
          handlePlayPause={handlePlayPause}
          isPlaying={isPlaying}
          seek={seek}
          duration={duration}
          isUserSeeking={isUserSeeking}
          userSeekPos={Number(userSeekPos)}
          handleOnChangeUserSeek={handleOnChangeUserSeek}
          handleMouseDownSeek={handleMouseDownSeek}
          handleMouseUpSeek={handleMouseUpSeek}
          isUserSettingVolume={isUserSettingVolume}
          userVolumeValue={userVolumeValue}
          handleOnChangeVolume={handleOnChangeVolume}
          handleMouseDownVolume={handleMouseDownVolume}
          handleMouseUpVolume={handleMouseUpVolume}
          handlePrev={handlePrevTrack}
          handleNext={handleNextTrack}
        />
      </CSSTransition>
    </>
  );
};

Player.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  current: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  duration: PropTypes.number,
  volume: PropTypes.number.isRequired,
  seek: PropTypes.number
};

Player.defaultProps = {
  duration: 0,
  seek: 0
};

const mapStateToProps = state => ({
  current: state.player.currentTrack,
  isPlaying: state.player.isPlaying,
  volume: state.player.volume,
  isMuted: state.player.isMuted,
  seek: state.player.seek,
  duration: state.player.duration
});

export default connect(mapStateToProps)(Player);
