import { useDispatch, useSelector } from "react-redux";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import { toggleKeyboardControlsMenu } from "../redux/actions/userActions";
import Modal from "./modal";
import formStyles from "../styles/form.module.scss";
import styles from "../styles/keyboardControls.module.scss";

const ControlsModal = () => {
  const dispatch = useDispatch();
  const isKeyboardControlsOpen = useSelector(
    state => state.user.settings.isKeyboardControlsOpen
  );

  function handleCloseControls(e) {
    dispatch(toggleKeyboardControlsMenu());

    if (e) {
      e.preventDefault();
    }
  }

  const controlsList = [
    { title: "Play / Pause", keys: ["Space"] },
    { title: "Mute / Unmute", keys: ["M"] },
    { title: "Seek Forward", keys: [faArrowRight] },
    { title: "Seek Backward", keys: [faArrowLeft] },
    { title: "Seek to 10% - 90%", keys: ["1 - 9"] },
    { title: "Volume Up", keys: ["Shift", faArrowUp] },
    { title: "Volume Down", keys: ["Shift", faArrowDown] },
    { title: "Show / Hide Queue", keys: ["Q"] },
    { title: "Show / Hide Controls", keys: ["H"] },
    { title: "Expand / Collapse Player", keys: ["F"] }
  ];

  return (
    <Modal
      title="Keyboard Controls"
      show={isKeyboardControlsOpen}
      onClose={handleCloseControls}
    >
      <ul
        className={formStyles.formInnerWrapper}
        style={{ paddingTop: "30px" }}
      >
        {controlsList.map(({ title, keys }) => (
          <li className={styles.controlsWrapper} key={title}>
            <h2>{title + ":"}</h2>
            <div>
              {keys.map((key, i, keys) => (
                <React.Fragment key={key}>
                  <span
                    style={keys[0] === "Space" ? { padding: "8px 30px" } : null}
                  >
                    {typeof key === "string" ? (
                      key
                    ) : (
                      <FontAwesomeIcon icon={key} />
                    )}
                  </span>
                  {i < keys.length - 1 && <FontAwesomeIcon icon={faPlus} />}
                </React.Fragment>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default ControlsModal;
