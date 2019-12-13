import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUndo } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/library.module.css";

const EditTextfield = ({ title, value, handleChange, original }) => (
  <label className={styles.editTextLabel} htmlFor={title}>
    <span>
      {`${title}:`}
      <button onClick={() => handleChange(original)} type="button">
        <FontAwesomeIcon icon={faUndo} />
      </button>
      {value !== original && (
        <FontAwesomeIcon icon={faCheck} style={{ color: "red" }} />
      )}
    </span>
    <input
      id={title}
      type="text"
      value={value}
      onChange={e => handleChange(e.target.value)}
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
  handleChange: PropTypes.func.isRequired,
  original: PropTypes.string.isRequired
};

export default EditTextfield;
