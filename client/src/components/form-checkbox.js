import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faGripLines } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import styles from "../styles/form.module.scss";

const FormCheckbox = ({
  title,
  i,
  value,
  numTracks,
  onChange,
  isDraggable
}) => {
  function handleOnChange() {
    onChange(i);
  }

  return (
    <label
      className={`${styles.checkboxLabel} ${value && styles.changesMade}`}
      htmlFor={`checkbox${i}`}
    >
      <span style={{ marginRight: "10px" }} className={styles.checkboxGrip}>
        {isDraggable && <FontAwesomeIcon icon={faGripLines} size="lg" />}
      </span>
      <span style={{ width: "240px" }}>{title}</span>
      <input
        id={`checkbox${i}`}
        type="checkbox"
        checked={value}
        onChange={handleOnChange}
      />
      <span>{`${numTracks} tracks`}</span>
      <span style={{ width: "20px", marginLeft: "15px" }}>
        {value && <FontAwesomeIcon icon={faCheck} size="lg" />}
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
