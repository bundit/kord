import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/library.module.css";

const Modal = ({ show, onClose, children }) =>
  show ? (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="presentation"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} type="button">
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>

        <div>{children}</div>
      </div>
    </div>
  ) : null;

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  children: PropTypes.node
};

Modal.defaultProps = {
  children: null
};

export default Modal;
