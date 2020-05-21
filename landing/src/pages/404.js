import React from "react";
import SEO from "../components/seo";
import styles from "../styles/landing.module.css";

const NotFoundPage = () => (
  <>
    <SEO title="404: Not found" />
    <div className={styles.p1} style={{ height: "auto" }}>
      <div className={styles.p1Content}>
        <h1
          className={styles.slogan}
          data-aos="fade-down"
          data-aos-easing="ease-in-out-back"
          data-aos-duration="3000"
          data-aos-delay="100"
        >
          404
        </h1>
        <h3
          data-aos="fade-down"
          data-aos-easing="ease-in-out-back"
          data-aos-duration="1200"
          data-aos-delay="1500"
        >
          Ruh roh, there&apos;s nothing here.
        </h3>
      </div>
    </div>
  </>
);

export default NotFoundPage;
