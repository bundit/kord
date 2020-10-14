import PropTypes from "prop-types";
import React from "react";
import styles from "../styles/image.module.scss";

const Image = ({ src, alt, className, style, children, ...props }) => {
  return (
    <div className={styles.imageWrapper} style={style}>
      <img
        src={src}
        alt={alt}
        {...props}
        className={`${styles.image} ${className}`}
      />
      {children}
    </div>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Image;
