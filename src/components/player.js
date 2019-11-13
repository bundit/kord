import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlayCircle,
  faPauseCircle,
  faForward,
  faBackward
} from "@fortawesome/free-solid-svg-icons";

import truncateString from "../utils/truncateString";
import styles from "../styles/player.module.css";

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
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

  render() {
    const { current, isPlaying } = this.props;
    const title = current ? current.title : "Nothing";
    const artistName = current ? current.artist.name : "Currently Playing";
    const { handlePlayPause, handleNext } = this;

    return (
      <div className={styles.playerWrapper}>
        <button type="button">
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
        <div className={styles.titleWrapper}>
          <div>
            <strong>{truncateString(title, 38)}</strong>
          </div>
          <div>{truncateString(artistName, 38)}</div>
        </div>
        <div>
          {/* <button type="button">
            <FontAwesomeIcon icon={faBackward} />
          </button> */}
          <button type="button" onClick={handlePlayPause}>
            <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlayCircle} />
          </button>
          <button type="button" onClick={handleNext}>
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
      </div>
    );
  }
}

Player.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  current: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  prevTrack: PropTypes.func.isRequired,
  nextTrack: PropTypes.func.isRequired
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
