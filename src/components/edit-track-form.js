import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Modal from "./modal";
import EditTextfield from "./edit-textfield";
import styles from "../styles/library.module.css";

const EditTrackForm = ({ show, onClose, track }) => {
  const {
    title,
    artist: { name: artistName },
    genre
  } = track;

  const [titleField, setTitleField] = useState(title);
  const [artistField, setArtistField] = useState(artistName);
  const [genreField, setGenreField] = useState(genre);

  useEffect(() => {
    // If any of these has changed then set them again
    setTitleField(title);
    setArtistField(artistName);
    setGenreField(genre);
  }, [title, artistName, genre]);

  return (
    <Modal show={show} onClose={onClose}>
      <h1 className="text-center">Edit Track</h1>
      <form
        className={styles.playlistForm}
        // onSubmit={}
      >
        <EditTextfield
          title="Title"
          value={titleField}
          onChange={setTitleField}
        />
        <EditTextfield
          title="Artist"
          value={artistField}
          onChange={setArtistField}
        />
        <EditTextfield
          title="Genre"
          value={genreField}
          onChange={setGenreField}
        />
        <button
          // style={{ visibility: isOneChecked ? "visible" : "hidden" }}
          type="submit"
        >
          Add
        </button>
      </form>
    </Modal>
  );
};

EditTrackForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  track: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.shape({ name: PropTypes.string }),
    genre: PropTypes.string
  })
};

EditTrackForm.defaultProps = {
  track: {
    title: "Title",
    artist: { name: "Artist" },
    genre: "Genre"
  }
};

export default EditTrackForm;
