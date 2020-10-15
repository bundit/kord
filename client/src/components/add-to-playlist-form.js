import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import React, { useState } from "react";

import { addTrackToPlaylists } from "../redux/actions/libraryActions";
import { capitalizeWord, filterUnconnected } from "../utils/formattingHelpers";
import { getImgUrl } from "../utils/getImgUrl";
import { toggleAddToPlaylistForm } from "../redux/actions/userActions";
import FormCheckbox from "./form-checkbox";
import Image from "./image";
import Modal from "./modal";
import TrackInfo from "./track-info";
import styles from "../styles/form.module.scss";

const AddToPlaylistForm = ({ show }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const track =
    useSelector(state => state.user.settings.currentTrackDropdown) || {};
  const playlists =
    useSelector(state => state.library.playlists[track.source]) || [];

  const connectedPlaylists = filterUnconnected(playlists); //playlists.filter(playlist => playlist.isConnected);

  const [checkedPlaylists, setCheckedPlaylists] = useState(
    initCheckboxes(connectedPlaylists)
  );

  const toggleCheckedPlaylist = playlistId => {
    setCheckedPlaylists({
      ...checkedPlaylists,
      [playlistId]: !checkedPlaylists[playlistId]
    });
  };

  const clearForm = () => {
    setCheckedPlaylists(initCheckboxes(connectedPlaylists));
  };

  function handleClose() {
    dispatch(toggleAddToPlaylistForm());
    clearForm();
  }

  function handleSubmit(e) {
    const playlistIds = Object.keys(checkedPlaylists).filter(
      playlistId => checkedPlaylists[playlistId]
    );

    dispatch(addTrackToPlaylists(playlistIds, track))
      .then(responses => {
        const numResponses = responses.length;

        if (numResponses) {
          alert.success(
            `Track added to ${numResponses > 1 ? numResponses : ""} playlist${
              numResponses > 1 ? "s" : ""
            }`
          );
        }
      })
      .catch(e => alert.error(e.message));
  }

  return (
    <Modal
      title={`Add to ${capitalizeWord(track.source)} Playlist`}
      show={show}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <div className={styles.formInnerWrapper}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Image
            src={getImgUrl(track, "md")}
            alt="album-art-md"
            style={{ margin: "30px auto 10px auto" }}
          />
          <TrackInfo track={track} isForm handleArtistClick={handleClose} />
        </div>
        <div className={styles.formTitle}>Select playlists to add to</div>
        {connectedPlaylists.map((playlist, i) => (
          <FormCheckbox
            title={playlist.title}
            key={`Add-to-${playlist.title}:${playlist.id}`}
            i={i}
            value={checkedPlaylists[playlist.id]}
            onChange={() => toggleCheckedPlaylist(playlist.id)}
            numTracks={playlist.total}
          />
        ))}
      </div>
    </Modal>
  );
};

function initCheckboxes(playlists, value = false) {
  const object = {};

  playlists.forEach(playlist => {
    object[playlist.id] = value;
  });

  return object;
}

AddToPlaylistForm.propTypes = {
  show: PropTypes.bool.isRequired
};

export default AddToPlaylistForm;
