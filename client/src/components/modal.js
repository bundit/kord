import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import {
  CancelButton,
  LargeIconButton as CloseButton,
  SubmitButton
} from "./buttons";
import { usePortal } from "../utils/hooks";
import Backdrop from "./backdrop";
import slideTransition from "../styles/slideModal.module.css";
import styles from "../styles/modal.module.scss";

const Modal = ({ title, show, onClose, onSubmit, children }) => {
  const target = usePortal("portal");

  function handleSubmit(e) {
    if (onSubmit) {
      onSubmit();
    }

    onClose();
    e.preventDefault();
  }

  return createPortal(
    <>
      <Backdrop show={show} handleClick={onClose} />
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
            <CloseButton icon={faTimes} onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            {children}
            <div className={styles.formCancelSubmitButtonGroup}>
              {onSubmit && <CancelButton onClick={onClose} />}
              <SubmitButton>Done</SubmitButton>
            </div>
          </form>
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
