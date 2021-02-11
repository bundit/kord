import React from "react";

import { capitalizeWord } from "../utils/formattingHelpers";
import styles from "../styles/select-menu.module.scss";

const SelectMenu = ({ name, selectedOption, onChange, values = [] }) => {
  return (
    <span>
      <select
        name={name}
        value={selectedOption}
        onChange={onChange}
        className={styles.selectMenu}
      >
        {values.map(value => (
          <option value={value} key={value}>
            {capitalizeWord(value)}
          </option>
        ))}
      </select>
    </span>
  );
};

export default SelectMenu;
