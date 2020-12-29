import { CSSTransition } from "react-transition-group";
import React from "react";
import fadeTransition from "../styles/fadeModal.module.css";
import styles from "../styles/modal.module.scss";

function Backdrop({ show, handleClick, children }) {
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
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {children}
      </div>
    </CSSTransition>
  );
}

export default Backdrop;
