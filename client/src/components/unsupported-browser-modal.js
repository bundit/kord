import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";

import { setShowUnsupportedBrowserModal } from "../redux/actions/userActions";
import Modal from "./modal";
import ToggleSwitch from "./toggle-switch";
import styles from "../styles/form.module.scss";

const UnsupportedBrowserModal = () => {
  const dispatch = useDispatch();
  const [disablePrompt, setDisablePrompt] = useState(
    localStorage.getItem("disablePrompt") === "true"
  );

  const showUnsupportedBrowserModal = useSelector(
    state => state.user.settings.showUnsupportedBrowserModal
  );

  function handleCloseModal() {
    localStorage.setItem("disablePrompt", disablePrompt);
    dispatch(setShowUnsupportedBrowserModal(false));
  }

  function toggleEnabledPrompt(e) {
    setDisablePrompt(e.target.checked);
  }

  return (
    <Modal
      title="Warning"
      show={showUnsupportedBrowserModal}
      onClose={handleCloseModal}
    >
      <div
        className={styles.formInnerWrapper}
        style={{ padding: "36px", boxSizing: "border-box" }}
      >
        <div
          className={styles.formTitle}
          style={{
            borderColor: "transparent",
            margin: "auto auto auto 0",
            display: "flex",
            alignItems: "center"
          }}
        >
          <span>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              size="3x"
              style={{ color: "#ff4411" }}
            />
          </span>
          <span style={{ marginLeft: "20px" }}>
            Warning, Unsupported Browser Detected
          </span>
        </div>
        <p>
          <i>
            You're seeing this message because you may be using an unsupported
            browser and features could be limited.
          </i>
        </p>
        <div className={styles.formTitle}>Kord Supported Browsers:</div>
        <ul>
          <li>Google Chrome</li>
          <li>Mozilla Firefox</li>
        </ul>

        <span
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-end"
          }}
        >
          <span style={{ marginRight: "10px" }}>Don't show me this again </span>
          <ToggleSwitch
            id="autoplay"
            value={disablePrompt}
            onChange={toggleEnabledPrompt}
          />
        </span>
      </div>
    </Modal>
  );
};

export default UnsupportedBrowserModal;
