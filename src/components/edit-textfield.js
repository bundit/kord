import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/library.module.css";

const EditTextfield = ({ title, value, onChange, original }) => (
  <label className={styles.editTextLabel} htmlFor={title}>
    <span>
      {`${title}:`}
      <FontAwesomeIcon
        icon={value === original ? faPen : faCheck}
        style={{ color: value === original ? "grey" : "red" }}
      />
    </span>
    <input
      id={title}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      // disable auto inputs
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
    />
  </label>
);

EditTextfield.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  original: PropTypes.string.isRequired
};

export default EditTextfield;
