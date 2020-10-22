import { CSSTransition } from "react-transition-group";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useRef } from "react";
import ReactHowler from "react-howler";
import raf from "raf";

import {
  IconButton as DesktopExpandButton,
  IconButton as DesktopMinimizeButton
} from "./buttons";
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
import UserQueue from "./user-queue";
import YoutubePlayer from "./youtube-player";
import slideTransition from "../styles/slide.module.css";
import styles from "../styles/player.module.scss";

export const Player = () => {
  const currentTrack = useSelector(state => state.player.currentTrack);
  const seek = useSelector(state => state.player.seek);
  const duration = useSelector(state => state.player.duration);
  const isMuted = useSelector(state => state.player.isMuted);
  const isPlaying = useSelector(state => state.player.isPlaying);
  let volume = useSelector(state => state.player.volume);

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
  useSetDurationOnTrackChange(currentTrack);
  usePauseIfSdkNotReady(currentTrack, isPlaying, isSpotifySdkReady);

  const renderSeekPos = React.useCallback(() => {
    const { source: currentSource } = currentTrack;
    let currentPos;

    try {
      if (currentSource === "soundcloud") {
        currentPos = soundcloudPlayer.current.seek();
      } else if (currentSource === "spotify") {
        currentPos = spotifyPlayer.current.seek() / 1000;
      } else if (currentSource === "youtube") {
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
  }, [currentTrack, dispatch]);

  useRenderSeekPosition(currentTrack, theRaf, renderSeekPos, isPlaying);
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
    const { source: currentSource } = currentTrack;
    raf.cancel(theRaf.current);

    if (seconds < 0) seconds = 0;
    if (seconds > duration) seconds = duration;

    if (currentSource === "soundcloud") {
      soundcloudPlayer.current.seek(seconds);
      dispatch(setSeek(seconds));
    }

    if (currentSource === "spotify") {
      spotifyPlayer.current.seek(seconds * 1000);
    }

    if (currentSource === "youtube") {
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
        if (key >= 1 && key <= 9) {
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
        dispatch(setTrackUnstreamable(currentTrack.id));
        handleNextTrack();
      }
    }
  }

  const KEY = process.env.REACT_APP_SC_KEY;

  return (
    <>
      <UserQueue />

      {/* Expanded music player */}
      <MinifiedPlayer
        isExpanded={isExpanded}
        handleToggleExpand={toggleExpand}
        handlePlayPause={handlePlayPause}
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

      <CSSTransition
        in={isExpanded}
        timeout={250}
        classNames={slideTransition}
        unmountOnExit
      >
        <ExpandedPlayer
          handleToggleExpand={toggleExpand}
          handlePlayPause={handlePlayPause}
          handleSeek={handleSeek}
          isUserSeeking={isUserSeeking}
          userSeekPos={Number(userSeekPos)}
          handleOnChangeUserSeek={handleOnChangeUserSeek}
          handleMouseDownSeek={handleMouseDownSeek}
          handleMouseUpSeek={handleMouseUpSeek}
          handlePrev={handlePrevTrack}
          handleNext={handleNextTrack}
        />
      </CSSTransition>
      {/* Mini Player */}

      {/* </CSSTransition> */}
      <audio id="player" autoPlay loop>
        <source
          src="https://raw.githubusercontent.com/anars/blank-audio/master/10-minutes-of-silence.mp3"
          type="audio/mp3"
        />
      </audio>
      {currentTrack.source === "soundcloud" && (
        <ReactHowler
          src={`https://api.soundcloud.com/tracks/${currentTrack.id}/stream?client_id=${KEY}`}
          playing={isPlaying && currentTrack.source === "soundcloud"}
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
        isPlaying={isPlaying && currentTrack.source === "spotify"}
        onEnd={handleOnEnd}
        volume={volume}
        track={currentTrack}
        onReady={handleSpotifyReady}
        onAccountError={handleSpotifyAccountError}
        controls={{ play: handlePlay, pause: handlePause }}
      />
      <div className={isExpanded ? styles.ytExpandedContainer : undefined}>
        <YoutubePlayer
          volume={volume}
          forwardRef={youtubePlayer}
          onEnd={handleOnEnd}
          playerIsExpanded={isExpanded}
        />
      </div>

      <DesktopMinimizeButton
        onClick={toggleExpand}
        icon={faAngleDown}
        className={`${
          currentTrack.source === "youtube"
            ? styles.desktopExpandPlayerButtonYT
            : styles.desktopExpandPlayerButton
        } ${isExpanded && styles.headerExpandButton}`}
      />
      <DesktopExpandButton
        onClick={toggleExpand}
        icon={isExpanded ? faAngleDown : faAngleUp}
        className={`${
          currentTrack.source === "youtube"
            ? styles.desktopExpandPlayerButtonYT
            : styles.desktopExpandPlayerButton
        }`}
      />
    </>
  );
};

export default Player;
