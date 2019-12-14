import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Modal from "./modal";
import EditTextfield from "./edit-textfield";
import styles from "../styles/library.module.css";

const EditTrackForm = ({ show, onClose, track, onSubmit }) => {
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

  const getEdittedText = () => ({
    trackEdit: { title: titleField, genre: genreField },
    artistEdit: { name: artistField }
  });

  const userMadeChanges = () =>
    title !== titleField || artistName !== artistField || genre !== genreField;

  const handleSubmit = e => {
    e.preventDefault();

    if (userMadeChanges()) {
      onSubmit(getEdittedText());
    }

    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h1 className="text-center">Edit Track</h1>
      <form className={styles.playlistForm} onSubmit={handleSubmit}>
        <EditTextfield
          title="Title"
          value={titleField}
          handleChange={setTitleField}
          original={title}
        />
        <EditTextfield
          title="Artist"
          value={artistField}
          handleChange={setArtistField}
          original={artistName}
        />
        <EditTextfield
          title="Genre"
          value={genreField}
          handleChange={setGenreField}
          original={genre}
        />
        <button
          style={{ visibility: userMadeChanges() ? "visible" : "hidden" }}
          type="submit"
        >
          Finish Edit
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
  }),
  onSubmit: PropTypes.func.isRequired
};

EditTrackForm.defaultProps = {
  track: {
    title: "Title",
    artist: { name: "Artist" },
    genre: "Genre"
  }
};

export default EditTrackForm;
