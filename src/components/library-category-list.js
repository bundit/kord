import React, { useEffect } from "react";
import PropTypes from "prop-types";

import CategoryListItem from "./category-list-item";
import scrollTop from "../utils/scrollTop";
import styles from "../styles/library.module.css";

function LibraryCategoryList({ categories }) {
  const categoryList = categories.map(category => (
    <CategoryListItem key={category} category={category} />
  ));

  useEffect(() => scrollTop(), []);

  return (
    <ul
      style={{ margin: "0", paddingLeft: "0", position: "absolute" }}
      className={styles.libraryWrapper}
    >
      {categoryList}
    </ul>
  );
}

LibraryCategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default LibraryCategoryList;
