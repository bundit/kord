import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styles from "../styles/library.module.css";

const CategoryListItem = ({ category }) => (
  <li
    style={{
      textDecoration: "none",
      listStyleType: "none",
      margin: "0"
    }}
    className={styles.trackWrapper}
  >
    <NavLink
      exact
      to={`/library/${category}`}
      className={styles.sectionLink}
      activeClassName={styles.activeSection}
    >
      <h2>{category}</h2>
    </NavLink>
  </li>
);

CategoryListItem.propTypes = {
  category: PropTypes.string.isRequired
};

export default CategoryListItem;
