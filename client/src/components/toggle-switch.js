import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/toggle-switch.module.scss";

const ToggleSwitch = ({ id, value, onChange, disabled }) => {
  return (
    <label htmlFor={id}>
      <div
        className={`${styles.toggleWrapper} ${
          disabled ? styles.disabledToggle : styles.enabledToggle
        }`}
      >
        <input
          id={id}
          type="checkbox"
          onChange={onChange}
          checked={value}
          disabled={disabled}
        />
        <span className={value ? styles.on : styles.off}></span>
      </div>
    </label>
  );
};

ToggleSwitch.propTypes = {
  value: PropTypes.bool
};

export default ToggleSwitch;
