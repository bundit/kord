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
import miniPlayerSlide from "../styles/miniPlayerSlide.module.css";
import slideTransition from "../styles/slide.module.css";

export const Player = ({ current, isPlaying, volume, seek, duration }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userSeekPos, setUserSeekPos] = useState(0);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const theRaf = useRef(null);
  const player = useRef(null);

  const dispatch = useDispatch();

  function handlePlayPause(e) {
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
    e.stopPropagation();
  }

  function handleOnLoad() {
    dispatch(setDuration(player.current.duration()));
    setIsLoaded(true);
  }

  function handleSeek(seconds) {
    if (player) {
      let newSeekPos = player.current.seek() + seconds;

      // Ensure our new seek position is within bounds
      newSeekPos = newSeekPos < 0 ? 0 : newSeekPos;
      newSeekPos = newSeekPos > duration ? duration : newSeekPos;

      // Move the player to the new position
      player.current.seek(newSeekPos);

      if (!isPlaying) {
        dispatch(setSeek(newSeekPos));
      }
    }
  }

  function toggleExpand(e) {
    setIsExpanded(!isExpanded);
    e.stopPropagation();
  }

  // When the user has released mouse/touch on slider,
  // we set the isUserSeeking to false to allow the
  // component to be controlled by the player
  function handleMouseUpSeek() {
    const newSeekPos = Number(userSeekPos);

    if (isLoaded) {
      player.current.seek(newSeekPos);

      dispatch(setSeek(newSeekPos));
    }

    setIsUserSeeking(false);
  }

  // This gets fired when the user is manually seeking using the slider
  function handleOnChangeUserSeek(e) {
    if (isUserSeeking) {
      setUserSeekPos(e.target.value);
    }
  }

  useEffect(() => {
    function renderSeekPos() {
      const currentPos = player.current.seek();

      // We need to check if seek is a number because there is a race condition in howler
      // where it will return the howler object if there is a playLock on it.
      if (typeof currentPos === "number") {
        dispatch(setSeek(currentPos));
      }

      theRaf.current = raf(renderSeekPos);
    }

    if (isPlaying && isLoaded) {
      renderSeekPos();
    } else {
      raf.cancel(theRaf.current);
    }

    return () => raf.cancel(theRaf);
  }, [isPlaying, isLoaded]);

  const KEY = process.env.REACT_APP_SC_KEY || process.env.SOUNDCLOUD_CLIENT_ID;

  return (
    <>
      {current.streamUrl && (
        <ReactHowler
          src={`${current.streamUrl}?client_id=${KEY}`}
          playing={isPlaying}
          onEnd={() => dispatch(nextTrack())}
          onLoad={handleOnLoad}
          preload
          html5
          volume={volume}
          ref={player}
        />
      )}
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
          handleMouseDownSeek={() => setIsUserSeeking(true)}
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
        />
      </CSSTransition>
    </>
  );
};

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
