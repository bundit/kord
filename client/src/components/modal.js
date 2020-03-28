import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";
import slideTransition from "../styles/slideModal.module.css";
import styles from "../styles/modal.module.css";

const Modal = ({
  title,
  show,
  onClose,
  children,
  isBackdropClosable = true
}) => (
  <>
    {show && (
      <div
        className={styles.backdrop}
        role="presentation"
        onClick={isBackdropClosable ? () => onClose() : null}
      />
    )}
    <CSSTransition
      in={show}
      timeout={200}
      classNames={slideTransition}
      unmountOnExit
    >
      <div
        className={styles.modal}
        role="presentation"
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>{title}</span>
          <button
            className={styles.closeButton}
            onClick={() => onClose()}
            type="button"
          >
            <FontAwesomeIcon icon={faTimes} size="2x" />
          </button>
        </div>

        {children}
      </div>
    </CSSTransition>
  </>
);

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  children: PropTypes.node
};

Modal.defaultProps = {
  children: null
};

export default Modal;
