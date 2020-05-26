import { CSSTransition } from "react-transition-group";
import { connect, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import ReactHowler from "react-howler";
import raf from "raf";

import {
  nextTrack,
  pause,
  play,
  prevTrack,
  setDuration,
  setMuted,
  setSeek,
  setVolume
} from "../redux/actions/playerActions";
import ExpandedPlayer from "./expanded-player";
import MinifiedPlayer from "./minified-player";
import SpotifyPlayer from "./spotify-player";
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
  const alert = useAlert();
  const dispatch = useDispatch();

  useSetDurationOnTrackChange(current);
  usePauseIfSdkNotReady(current, isPlaying, isSpotifySdkReady);
  const renderSeekPos = React.useCallback(() => {
    let currentPos;
    try {
      if (current.source === "soundcloud") {
        currentPos = soundcloudPlayer.current.seek();
      } else if (current.source === "spotify") {
        currentPos = spotifyPlayer.current.seek() / 1000;
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
  }, [current.source, dispatch]);

  useRenderSeekPosition(current, theRaf, renderSeekPos, isPlaying);

  function handlePlayPause(e) {
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
    e.stopPropagation();
  }

  function handleSpotifyReady() {
    setIsSpotifySdkReady(true);
  }

  function handleSpotifyNotReady() {
    setIsSpotifySdkReady(false);
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

    if (isSpotifySdkReady && current.source === "spotify") {
      spotifyPlayer.current.seek(seconds * 1000);
    }

    dispatch(setSeek(seconds));

    setTimeout(() => renderSeekPos(), 300);
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
        handleNextTrack();
      }
    }
  }

  const KEY = process.env.REACT_APP_SC_KEY;

  return (
    <>
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
        onNotReady={handleSpotifyNotReady}
        onAccountError={handleSpotifyAccountError}
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
          volume={volume}
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

function useSetDurationOnTrackChange(current) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSeek(0));
    dispatch(setDuration(Math.round(current.duration / 1000)));
  }, [current, dispatch]); // Song was changed
}

function usePauseIfSdkNotReady(current, isPlaying, isSpotifySdkReady) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Prevent play if player is not ready
    if (current.source === "spotify") {
      if (isPlaying && !isSpotifySdkReady) {
        dispatch(pause());
      }
    }
  }, [isPlaying, current, isSpotifySdkReady, dispatch]);
}

function useRenderSeekPosition(current, theRaf, renderSeekPos, isPlaying) {
  useEffect(() => {
    raf.cancel(theRaf.current);

    if (isPlaying) {
      renderSeekPos();
    } else raf.cancel(theRaf.current);

    return () => raf.cancel(theRaf);
  }, [current, isPlaying, theRaf, renderSeekPos]); // Stop or start RAF when play/pause and song changes
}

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
