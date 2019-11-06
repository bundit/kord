import React from "react";
import { connect } from "react-redux";

import { importSoundcloudLikes } from "../../redux/actions/libraryActions";
import styles from "../../styles/library.module.css";

// eslint-disable-next-line
class Library extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    // bind methods
  }

  render() {
    const { library } = this.props;

    return (
      <div className={styles.libraryContainer}>
        <div>{library && library.map(song => <p>{song.artist}</p>)}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  library: state.music.library
});

const mapDispatchToProps = {
  importSoundcloudLikes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
