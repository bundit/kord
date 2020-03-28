import React from "react";
import PropTypes from "prop-types";

import Modal from "./modal";
import styles from "../styles/modal.module.css";

const NewPlaylistForm = ({ show, value, onClose, onChange, onSubmit }) => (
  <Modal title="New Playlist" show={true} onClose={onClose}>
    <form className={styles.modalForm} onSubmit={onSubmit}>
      <label htmlFor="playlistname" className={styles.formLabel}>
        <div className={styles.formInnerWrapper}>
          <h2>Enter a playlist name:</h2>
          <input
            ref={input => input && input.focus()}
            id="playlistname"
            type="text"
            placeholder="Playlist Name"
            onChange={e => onChange(e.target.value)}
            value={value}
            // disable auto inputs
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      </label>
      <div className={styles.formCancelSubmitButtonGroup}>
        <button
          type="button"
          className={styles.formCancelButton}
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className={styles.formSubmitButton}>
          Create
        </button>
      </div>
    </form>
  </Modal>
);

NewPlaylistForm.propTypes = {
  show: PropTypes.bool.isRequired,
  value: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

NewPlaylistForm.defaultProps = {
  value: ""
};

export default NewPlaylistForm;
