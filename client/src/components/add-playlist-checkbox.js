import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/library.module.css";

const AddToPlaylistCheckbox = ({ title, i, value, onChange }) => (
  <label className={styles.checkboxLabel} htmlFor={`checkbox${i}`}>
    <span>{title}</span>
    <input
      id={`checkbox${i}`}
      type="checkbox"
      checked={value}
      onChange={() => onChange(title)}
    />
    <FontAwesomeIcon
      icon={faCheck}
      style={{
        color: value ? "red" : "grey"
      }}
      size="lg"
    />
  </label>
);

AddToPlaylistCheckbox.propTypes = {
  title: PropTypes.string.isRequired,
  i: PropTypes.number.isRequired,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

AddToPlaylistCheckbox.defaultProps = {
  value: false
};

export default AddToPlaylistCheckbox;
