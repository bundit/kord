import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import scrollTop from "../utils/scrollTop";
import styles from "../styles/library.module.css";

const CategoryListItem = ({ category }) => (
  <NavLink
    to={`/app/library/${category.toLowerCase()}`}
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
