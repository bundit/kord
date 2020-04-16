import { CSSTransition } from "react-transition-group";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import ReactHowler from "react-howler";
import raf from "raf";

import {
  nextTrack,
  pause,
  play,
  setDuration,
  setSeek
} from "../redux/actions/playerActions";
import ExpandedPlayer from "./expanded-player";
import MinifiedPlayer from "./minified-player";
import SpotifyPlayer from "./spotify-player";
import miniPlayerSlide from "../styles/miniPlayerSlide.module.css";
import slideTransition from "../styles/slide.module.css";

export const Player = ({ current, isPlaying, volume, seek, duration }) => {
  const [isSpotifySdkReady, setIsSpotifySdkReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userSeekPos, setUserSeekPos] = useState(0);
  const [isUserSeeking, setIsUserSeeking] = useState(false);

  const soundcloudPlayer = useRef(null);
  const spotifyPlayer = useRef(null);

  const dispatch = useDispatch();

  useSetDurationOnTrackChange(current);
  usePauseIfSdkNotReady(current, isPlaying, isSpotifySdkReady);
  useRenderSeekPosition(current, isPlaying, soundcloudPlayer, spotifyPlayer);

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

  function handleSeek(seconds) {
    if (soundcloudPlayer.current) {
      let newSeekPos = soundcloudPlayer.current.seek() + seconds;

      // Ensure our new seek position is within bounds
      newSeekPos = newSeekPos < 0 ? 0 : newSeekPos;
      newSeekPos = newSeekPos > duration ? duration : newSeekPos;

      // Move the player to the new position
      soundcloudPlayer.current.seek(newSeekPos);

      if (!isPlaying) {
        dispatch(setSeek(newSeekPos));
      }
    }
  }

  function handleMouseDownSeek() {
    setIsUserSeeking(true);
  }

  // When the user has released mouse/touch on slider,
  // we set the isUserSeeking to false to allow the
  // component to be controlled by the player
  function handleMouseUpSeek() {
    const newSeekPos = Number(userSeekPos);

    if (current.source === "soundcloud") {
      soundcloudPlayer.current.seek(newSeekPos);
      dispatch(setSeek(newSeekPos));
    }

    if (isSpotifySdkReady && current.source === "spotify") {
      spotifyPlayer.current.seek(newSeekPos * 1000);
      dispatch(setSeek(newSeekPos));
    }

    setIsUserSeeking(false);
  }

  const KEY = process.env.REACT_APP_SC_KEY || process.env.SOUNDCLOUD_CLIENT_ID;

  return (
    <>
      {current.source === "soundcloud" && (
        <ReactHowler
          src={`${current.streamUrl}?client_id=${KEY}`}
          playing={isPlaying && current.source === "soundcloud"}
          onEnd={handleOnEnd}
          preload
          html5
          volume={volume}
          ref={soundcloudPlayer}
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
        />
      </CSSTransition>
    </>
  );
};

function useSetDurationOnTrackChange(current) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSeek(0));
    dispatch(setDuration(current.duration / 1000));
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

function useRenderSeekPosition(
  current,
  isPlaying,
  soundcloudPlayer,
  spotifyPlayer
) {
  const theRaf = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    raf.cancel(theRaf.current);

    function renderSeekPos() {
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
        dispatch(setSeek(currentPos));
      }

      setTimeout(() => (theRaf.current = raf(renderSeekPos)), 300);
    }

    if (isPlaying) {
      renderSeekPos();
    } else raf.cancel(theRaf.current);

    return () => raf.cancel(theRaf);
  }, [current, isPlaying, soundcloudPlayer, spotifyPlayer, dispatch]); // Stop or start RAF when play/pause and song changes
}

Player.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  current: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  seek: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  current: state.player.currentTrack,
  isPlaying: state.player.isPlaying,
  volume: state.player.volume,
  seek: state.player.seek,
  duration: state.player.duration
});

export default connect(mapStateToProps)(Player);
