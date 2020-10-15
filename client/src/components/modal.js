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
import fadeTransition from "../styles/fadeModal.module.css";
import slideTransition from "../styles/slideModal.module.css";
import styles from "../styles/modal.module.scss";
import usePortal from "../utils/usePortal";

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
      <ModalBackdrop show={show} handleClick={onClose} />
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

function ModalBackdrop({ show, handleClick }) {
  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames={fadeTransition}
      unmountOnExit
    >
      <div
        className={styles.backdrop}
        role="presentation"
        onClick={handleClick}
      />
    </CSSTransition>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  children: PropTypes.node
};

Modal.defaultProps = {
  children: null
};

export default Modal;
