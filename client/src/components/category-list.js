import React, { useEffect } from "react";
import PropTypes from "prop-types";

import CategoryListItem from "./category-list-item";
import scrollTop from "../utils/scrollTop";
import styles from "../styles/library.module.css";

function CategoryList({ categories, mobile }) {
  const categoryList = categories.map(category => (
    <CategoryListItem key={category} category={category} />
  ));

  useEffect(() => scrollTop(), []);

  return (
    <ul
      style={{ margin: "0", padding: 0 }}
      className={`${styles.categoryListWrapper} ${
        mobile ? styles.mobileCategoryList : styles.desktopCategoryList
      }`}
    >
      {categoryList}
    </ul>
  );
}

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default CategoryList;
