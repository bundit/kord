import React from "react";
import { CSSTransition } from "react-transition-group";
import ReactHowler from "react-howler";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import raf from "raf";
import {
  faAngleUp,
  faPlayCircle,
  faPauseCircle,
  faForward,
  faBackward,
  faAngleDown,
  faFastForward,
  faFastBackward
  // faVolumeOff,
  // faVolumeUp
} from "@fortawesome/free-solid-svg-icons";

import truncateString from "../utils/truncateString";
import secondsToFormatted from "../utils/secondsToFormatted";
import styles from "../styles/player.module.css";
import slideTransition from "../styles/slide.module.css";
import placeholderImg from "../assets/placeholder.png";

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleToggleExpand = this.handleToggleExpand.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.renderSeekPos = this.renderSeekPos.bind(this);
    this.handleMouseDownSeek = this.handleMouseDownSeek.bind(this);
    this.handleMouseUpSeek = this.handleMouseUpSeek.bind(this);
    this.handleOnChangeUserSeek = this.handleOnChangeUserSeek.bind(this);

    this.state = {
      userSeekPos: 0,
      isUserSeeking: false
    };
  }

  componentWillUnmount() {
    // Clear the RAF
    raf.cancel(this.raf);
  }

  handlePlayPause(event) {
    const { isPlaying, play, pause } = this.props;

    if (isPlaying) {
      pause();
    } else {
      play();
    }

    // Don't bubble this event to containers
    event.stopPropagation();
  }

  handleOnLoad() {
    const { setDuration, setIsLoaded } = this.props;
    const { player } = this;

    // Once our track has loaded, we want to set the duration of the file
    setDuration(player.duration());

    // Set isLoaded to true
    setIsLoaded(true);
  }

  // Given a positive or negative number, the player will seek based on its current position
  // handleSeek(15) will move the current seek position 15 seconds forward
  // handleSeek(-10) will move the current seek position 10 seconds backward
  // Can be called whether or not player is currently playing
  handleSeek(s) {
    const { player } = this;
    const { isPlaying, setSeek, duration } = this.props;

    if (player) {
      let newSeekPos = player.seek() + s;

      // Ensure our new seek position is within bounds
      newSeekPos = newSeekPos < 0 ? 0 : newSeekPos;
      newSeekPos = newSeekPos > duration ? duration : newSeekPos;

      // Move the player to the new position
      player.seek(newSeekPos);

      // This ensures that we show the updated seek position on the slider
      // even if we are not currently playing
      if (!isPlaying) {
        setSeek(newSeekPos);
      }
    }
  }

  handleNext() {
    const { nextTrack } = this.props;
    nextTrack();
  }

  handlePrev() {
    const { prevTrack } = this.props;
    prevTrack();
  }

  handleToggleExpand(e) {
    const { toggleExpandedPlayer } = this.props;

    toggleExpandedPlayer();

    // Stop the event from bubbling
    e.stopPropagation();
  }

  handleMouseDownSeek() {
    this.setState({
      isUserSeeking: true
    });
  }

  // When the user has released mouse/touch on slider,
  // we set the isUserSeeking to false to allow the
  // component to be controlled by the player
  handleMouseUpSeek() {
    const { player } = this;
    let { userSeekPos } = this.state;
    const { setSeek } = this.props;

    // setting e.target.value to state defaults to string
    userSeekPos = Number(userSeekPos);

    // Set our howler seek position
    player.seek(userSeekPos);

    // Set our state seek position so it can render on slider
    setSeek(userSeekPos);

    // User is done seeking
    this.setState({
      isUserSeeking: false
    });
  }

  // This gets fired when the user is manually seeking using the slider
  handleOnChangeUserSeek(e) {
    this.setState({
      userSeekPos: e.target.value
    });
  }

  // This function will be called 'onPlay' by ReactHowler, and only needs to be called
  // in that scenario because we only need to render frames when the audio track is playing,
  // otherwise animation should be *static*
  //
  // Uses 'raf' (requestAnimationFrame polyfill)
  // renders the seek position of the currently playing track on input slider
  renderSeekPos() {
    const { isPlaying, setSeek, isLoaded } = this.props;
    const { player } = this;

    // If the player is playing && the track has been loaded
    if (isPlaying && isLoaded) {
      const currentPos = player.seek();

      // We need to check if seek is a number because there is a race condition in howler
      // where it will return the howler object if there is a playLock on it.
      if (typeof currentPos === "number") {
        setSeek(currentPos);
      }

      // Continue rendering
      this.raf = raf(this.renderSeekPos);
    }
  }

  render() {
    const { current, isPlaying } = this.props;
    const title = current ? current.title : "Nothing";
    const artistName = current ? current.artist.name : "Currently Playing";
    const {
      handlePlayPause,
      handlePrev,
      handleNext,
      handleToggleExpand,
      handleSeek,
      handleMouseDownSeek,
      handleMouseUpSeek,
      handleOnChangeUserSeek,
      renderSeekPos
    } = this;
    const { isExpanded, volume, seek, duration } = this.props;
    const { isUserSeeking, userSeekPos } = this.state;
    const KEY = process.env.REACT_APP_SC_KEY;

    return (
      <>
        {current && (
          <ReactHowler
            src={`${current.streamUrl}?client_id=${KEY}`}
            playing={isPlaying}
            onEnd={handleNext}
            onPlay={renderSeekPos}
            onLoad={this.handleOnLoad}
            preload
            html5
            volume={volume}
            ref={ref => {
              this.player = ref;
            }}
          />
        )}
        <CSSTransition
          in={isExpanded}
          timeout={300}
          classNames={slideTransition}
          unmountOnExit
        >
          <div className={`${styles.playerWrapper} ${styles.playerOpen}`}>
            <button
              type="button"
              onClick={handleToggleExpand}
              className={styles.closeButton}
            >
              <FontAwesomeIcon icon={faAngleDown} size="2x" />
            </button>
            <img
              src={
                current
                  ? current.img.replace("large.jpg", "t500x500.jpg")
                  : placeholderImg
              }
              alt="album-artwork.jpg"
            />
            <div className={styles.expandedPlayerControls}>
              <button type="button" onClick={handlePrev}>
                <FontAwesomeIcon icon={faBackward} size="4x" />
              </button>
              <button type="button" onClick={() => handleSeek(-15)}>
                <FontAwesomeIcon icon={faFastBackward} size="2x" />
              </button>
              <button type="button" onClick={handlePlayPause}>
                <FontAwesomeIcon
                  size="7x"
                  icon={isPlaying ? faPauseCircle : faPlayCircle}
                />
              </button>
              <button type="button" onClick={() => handleSeek(15)}>
                <FontAwesomeIcon icon={faFastForward} size="2x" />
              </button>
              <button type="button" onClick={handleNext}>
                <FontAwesomeIcon icon={faForward} size="4x" />
              </button>
            </div>
            <div className={styles.titleWrapperExpanded}>
              <div>
                <strong>{truncateString(title, 45)}</strong>
              </div>
              <div>{truncateString(artistName, 45)}</div>
            </div>
            {/* SEEK INPUT */}
            <div className={styles.volumeContainer}>
              <span>
                {isUserSeeking
                  ? secondsToFormatted(userSeekPos)
                  : secondsToFormatted(seek)}
              </span>
              <span className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="any"
                  value={isUserSeeking ? userSeekPos : seek}
                  onChange={
                    isUserSeeking ? handleOnChangeUserSeek : renderSeekPos
                  }
                  onMouseDown={handleMouseDownSeek}
                  onMouseUp={handleMouseUpSeek}
                  onTouchStart={handleMouseDownSeek}
                  onTouchEnd={handleMouseUpSeek}
                />
              </span>
              <span>{secondsToFormatted(duration)}</span>
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          in={!isExpanded}
          timeout={300}
          classNames={slideTransition}
          unmountOnExit
        >
          <div
            className={styles.playerWrapper}
            tabIndex="0"
            onKeyPress={handleToggleExpand}
            role="button"
            onClick={handleToggleExpand}
          >
            <button type="button" onClick={handleToggleExpand}>
              <FontAwesomeIcon icon={faAngleUp} />
            </button>
            <div className={styles.titleWrapper}>
              <div>
                <strong>{truncateString(title, 38)}</strong>
              </div>
              <div>{truncateString(artistName, 38)}</div>
            </div>
            <div>
              <button type="button" onClick={handlePlayPause}>
                <FontAwesomeIcon
                  icon={isPlaying ? faPauseCircle : faPlayCircle}
                />
              </button>
            </div>
          </div>
        </CSSTransition>
      </>
    );
  }
}

Player.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  current: PropTypes.object,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  prevTrack: PropTypes.func.isRequired,
  nextTrack: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  setDuration: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpandedPlayer: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  setIsLoaded: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  seek: PropTypes.number.isRequired,
  setSeek: PropTypes.func.isRequired
};

Player.defaultProps = {
  current: null
};

const mapStateToProps = state => ({
  current: state.musicPlayer.currentTrack,
  isPlaying: state.musicPlayer.isPlaying,
  isExpanded: state.musicPlayer.isExpanded,
  isLoaded: state.musicPlayer.isLoaded,
  volume: state.musicPlayer.volume,
  seek: state.musicPlayer.seek,
  duration: state.musicPlayer.duration
});

const mapDispatchToProps = dispatch => ({
  play: () =>
    dispatch({
      type: "PLAY"
    }),
  toggleExpandedPlayer: () =>
    dispatch({
      type: "TOGGLE_EXPANDED_PLAYER"
    }),
  setIsLoaded: isLoaded =>
    dispatch({
      type: "SET_IS_LOADED",
      payload: isLoaded
    }),
  setDuration: duration =>
    dispatch({
      type: "SET_DURATION",
      payload: duration
    }),
  setSeek: newSeek =>
    dispatch({
      type: "SET_SEEK",
      payload: newSeek
    }),
  pause: () =>
    dispatch({
      type: "PAUSE"
    }),
  nextTrack: () =>
    dispatch({
      type: "NEXT_TRACK"
    }),
  prevTrack: () =>
    dispatch({
      type: "PREV_TRACK"
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);
