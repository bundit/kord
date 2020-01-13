import React from "react";
import PropTypes from "prop-types";

import Modal from "./modal";
import styles from "../styles/library.module.css";

const DeleteTrackForm = ({ show, onClose, track, onSubmit }) => (
  <Modal show={show} onClose={onClose}>
    <h1 className="text-center">Are you sure?</h1>

    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      Are you sure you want to delete
      <br />
      {`"${track.title}"`}
      <br />
      {`by "${track.artist.name}"?`}
    </div>

    <div className={styles.confirmWrapper}>
      <button
        type="button"
        // Arrow function below is used to prevent the event object being passed to the reducer
        onClick={() => onClose()}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={() => {
          onSubmit();
          onClose();
        }}
      >
        Confirm
      </button>
    </div>
  </Modal>
);

DeleteTrackForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  track: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default DeleteTrackForm;
