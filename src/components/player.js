import React from "react";
import PropTypes from "prop-types";
import ReactHowler from "react-howler";
import raf from "raf";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";

import ExpandedPlayer from "./expanded-player";
import MinifiedPlayer from "./minified-player";
import slideTransition from "../styles/slide.module.css";

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
    const { setSeek, isLoaded } = this.props;

    // setting e.target.value to state defaults to string
    userSeekPos = Number(userSeekPos);

    if (isLoaded) {
      // Set our howler seek position
      player.seek(userSeekPos);

      // Set our state seek position so it can render on slider
      setSeek(userSeekPos);
    }

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
    const {
      current,
      isPlaying,
      isExpanded,
      volume,
      seek,
      duration
    } = this.props;
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
    const { isUserSeeking, userSeekPos } = this.state;
    const KEY = process.env.REACT_APP_SC_KEY;

    return (
      <>
        {current.streamUrl && (
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
        {/* Expanded music player */}
        <CSSTransition
          in={isExpanded}
          timeout={300}
          classNames={slideTransition}
          unmountOnExit
        >
          <ExpandedPlayer
            current={current}
            handleToggleExpand={handleToggleExpand}
            handlePlayPause={handlePlayPause}
            isPlaying={isPlaying}
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleSeek={handleSeek}
            isUserSeeking={isUserSeeking}
            userSeekPos={userSeekPos}
            seek={seek}
            duration={duration}
            handleOnChangeUserSeek={handleOnChangeUserSeek}
            renderSeekPos={renderSeekPos}
            handleMouseDownSeek={handleMouseDownSeek}
            handleMouseUpSeek={handleMouseUpSeek}
          />
        </CSSTransition>
        {/* Mini Player */}
        <CSSTransition
          in={!isExpanded}
          timeout={300}
          classNames={slideTransition}
          unmountOnExit
        >
          <MinifiedPlayer
            title={current.title}
            artist={current.artist.name}
            handleToggleExpand={handleToggleExpand}
            handlePlayPause={handlePlayPause}
            isPlaying={isPlaying}
          />
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
  current: {
    title: "Nothing",
    artist: {
      name: "Currently Playing"
    }
  }
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
