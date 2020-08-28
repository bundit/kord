import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { formatArtistName } from "../utils/formattingHelpers";
import { getImgUrl } from "../utils/getImgUrl";
import { removeFromPlaylist } from "../redux/actions/libraryActions";
import { toggleDeleteTrackForm } from "../redux/actions/userActions";
import Modal from "./modal";
import styles from "../styles/modal.module.css";

const DeleteTrackForm = ({ show }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const track =
    useSelector(state => state.user.settings.currentTrackDropdown) || {};

  function handleClose() {
    dispatch(toggleDeleteTrackForm());
  }

  function handleSubmit(e) {
    e.preventDefault();

    dispatch(removeFromPlaylist(track))
      .then(() => {
        alert.success("Track removed");
      })
      .catch(e => alert.error(e.message));
    handleClose();
  }

  return (
    <Modal
      title={`Remove Track from Playlist`}
      show={show}
      onClose={handleClose}
    >
      <form className={styles.modalForm} onSubmit={handleSubmit}>
        <div
          className={styles.formInnerWrapper}
          style={{
            padding: "30px",
            paddingLeft: "36px",
            boxSizing: "border-box",
            overflow: "hidden"
          }}
        >
          <div
            className={styles.formTitle}
            style={{
              borderColor: "transparent",
              margin: "auto auto auto 0",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: 0
            }}
          >
            <div style={{ marginRight: "20px" }}>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size="3x"
                style={{ color: "#ff4411" }}
              />
            </div>
            <span>Are you sure you want to remove this track?</span>
          </div>
          <div style={{ margin: "0 auto" }}>
            <img
              src={getImgUrl(track, "md")}
              className={styles.confirmAlbumArt}
              alt="album-art-md"
            />
          </div>
          <div className={styles.trackInfoWrap}>
            <div>{track.title} </div>
            <div>{formatArtistName(track.artist)}</div>
          </div>
        </div>
        <div className={styles.formCancelSubmitButtonGroup}>
          <button
            type="button"
            className={styles.formCancelButton}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button type="submit" className={styles.formSubmitButton}>
            Confirm
          </button>
        </div>
      </form>
    </Modal>
  );
};

DeleteTrackForm.propTypes = {
  show: PropTypes.bool.isRequired
};

export default DeleteTrackForm;
