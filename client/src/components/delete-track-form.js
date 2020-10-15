import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { getImgUrl } from "../utils/getImgUrl";
import { removeFromPlaylist } from "../redux/actions/libraryActions";
import { toggleDeleteTrackForm } from "../redux/actions/userActions";
import Image from "./image";
import Modal from "./modal";
import TrackInfo from "./track-info";
import styles from "../styles/form.module.scss";

const DeleteTrackForm = ({ show }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const track =
    useSelector(state => state.user.settings.currentTrackDropdown) || {};

  function handleClose() {
    dispatch(toggleDeleteTrackForm());
  }

  function handleSubmit(e) {
    dispatch(removeFromPlaylist(track))
      .then(() => {
        alert.success("Track removed");
      })
      .catch(e => alert.error(e.message));
  }

  return (
    <Modal
      title={`Remove Track from Playlist`}
      show={show}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
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
        <Image
          src={getImgUrl(track, "md")}
          alt="album-art-md"
          style={{ margin: "30px auto 10px auto" }}
        />
        <TrackInfo track={track} isForm handleArtistClick={handleClose} />
      </div>
    </Modal>
  );
};

DeleteTrackForm.propTypes = {
  show: PropTypes.bool.isRequired
};

export default DeleteTrackForm;
