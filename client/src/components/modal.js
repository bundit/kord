import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import slideTransition from "../styles/slideModal.module.css";
import fadeTransition from "../styles/fadeModal.module.css";
import styles from "../styles/modal.module.css";
import usePortal from "../utils/usePortal";

const Modal = ({
  title,
  show,
  onClose,
  children,
  isBackdropClosable = true
}) => {
  const target = usePortal("portal");

  return createPortal(
    <>
      <CSSTransition
        in={show}
        timeout={300}
        classNames={fadeTransition}
        unmountOnExit
      >
        <div
          className={styles.backdrop}
          role="presentation"
          onClick={isBackdropClosable ? onClose : null}
        />
      </CSSTransition>
      <CSSTransition
        in={show}
        timeout={350}
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
    </>,
    target
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  children: PropTypes.node
};

Modal.defaultProps = {
  children: null
};

export default Modal;
