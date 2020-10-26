import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/toggle-switch.module.scss";

const ToggleSwitch = ({ id, value, onChange }) => {
  return (
    <label htmlFor={id}>
      <div className={styles.toggleWrapper}>
        <input id={id} type="checkbox" onChange={onChange} checked={value} />
        <span className={value ? styles.on : styles.off}></span>
      </div>
    </label>
  );
};

ToggleSwitch.propTypes = {
  value: PropTypes.bool
};

export default ToggleSwitch;
