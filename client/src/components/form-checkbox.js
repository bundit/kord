import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import styles from "../styles/modal.module.css";

const FormCheckbox = ({ title, i, value, numTracks, onChange }) => {
  function handleOnChange() {
    onChange(i);
  }

  return (
    <label
      className={`${styles.checkboxLabel} ${value ? styles.changesMade : null}`}
      htmlFor={`checkbox${i}`}
    >
      <span style={{ width: "260px" }}>{title}</span>
      <input
        id={`checkbox${i}`}
        type="checkbox"
        checked={value}
        onChange={handleOnChange}
      />
      <span>{`${numTracks} tracks`}</span>
      <span style={{ width: "16px", marginLeft: "auto" }}>
        {value && <FontAwesomeIcon icon={value && faCheck} size="lg" />}
      </span>
    </label>
  );
};

FormCheckbox.propTypes = {
  title: PropTypes.string.isRequired,
  i: PropTypes.number.isRequired,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

FormCheckbox.defaultProps = {
  value: false
};

export default FormCheckbox;
