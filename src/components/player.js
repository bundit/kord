import React from "react";
import { CSSTransition } from "react-transition-group";
import ReactHowler from "react-howler";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlayCircle,
  faPauseCircle,
  faForward,
  faBackward,
  faAngleDown,
  faFastForward,
  faFastBackward
} from "@fortawesome/free-solid-svg-icons";

import truncateString from "../utils/truncateString";
import styles from "../styles/player.module.css";
import slideTransition from "../styles/slide.module.css";
import placeholderImg from "../assets/placeholder.png";

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: true
    };

    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.toggleExpandedPlayer = this.toggleExpandedPlayer.bind(this);
  }

  handlePlayPause() {
    const { isPlaying, play, pause } = this.props;

    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  handleSeek() {}

  handleNext() {
    const { nextTrack } = this.props;
    nextTrack();
  }

  handlePrev() {
    const { prevTrack } = this.props;
    prevTrack();
  }

  toggleExpandedPlayer() {
    const { isExpanded } = this.state;
    this.setState({
      isExpanded: !isExpanded
    });
  }

  render() {
    const { current, isPlaying } = this.props;
    const title = current ? current.title : "Nothing";
    const artistName = current ? current.artist.name : "Currently Playing";
    const {
      handlePlayPause,
      handlePrev,
      handleNext,
      toggleExpandedPlayer
    } = this;
    const { isExpanded } = this.state;
    const KEY = process.env.REACT_APP_SC_KEY;

    return (
      <>
        {current && (
          <ReactHowler
            src={`${current.streamUrl}?client_id=${KEY}`}
            playing={isPlaying}
            onEnd={handleNext}
            preload
            html5
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
              onClick={toggleExpandedPlayer}
              className={styles.closeButton}
            >
              <FontAwesomeIcon icon={faAngleDown} size="2x" />
            </button>
            <img src={current ? current.img : placeholderImg} alt="" />
          </div>
        </CSSTransition>
        <CSSTransition
          in={!isExpanded}
          timeout={300}
          classNames={slideTransition}
          unmountOnExit
        >
          <div className={styles.playerWrapper}>
            <button type="button" onClick={toggleExpandedPlayer}>
              <FontAwesomeIcon icon={faAngleUp} />
            </button>
            <div className={styles.titleWrapper}>
              <div>
                <strong>{truncateString(title, 38)}</strong>
              </div>
              <div>{truncateString(artistName, 38)}</div>
            </div>
            <div>
              {/* <button type="button" onClick={handlePrev}>
                  <FontAwesomeIcon icon={faBackward} />
              </button> */}
              <button type="button" onClick={handlePlayPause}>
                <FontAwesomeIcon
                  icon={isPlaying ? faPauseCircle : faPlayCircle}
                />
              </button>
              {/* <button type="button" onClick={handleNext}>
                  <FontAwesomeIcon icon={faForward} />
              </button> */}
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
  isPlaying: PropTypes.bool.isRequired,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  prevTrack: PropTypes.func.isRequired,
  nextTrack: PropTypes.func.isRequired
};

Player.defaultProps = {
  current: null
};

const mapStateToProps = state => ({
  current: state.musicPlayer.currentTrack,
  isPlaying: state.musicPlayer.isPlaying
});

const mapDispatchToProps = dispatch => ({
  play: () =>
    dispatch({
      type: "PLAY"
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
