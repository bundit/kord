import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import scrollTop from "../utils/scrollTop";
import styles from "../styles/library.module.css";

const CategoryListItem = ({ category }) => (
  <NavLink
    exact
    to={`/app/library/${category}`}
    className={styles.categoryWrapper}
    activeClassName={styles.activeSection}
    onClick={scrollTop}
  >
    {category}
  </NavLink>
);

CategoryListItem.propTypes = {
  category: PropTypes.string.isRequired
};

export default CategoryListItem;
