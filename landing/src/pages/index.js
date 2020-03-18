import React from "react";
import { Link } from "gatsby";
import SEO from "../components/seo";
import styles from "../components/styles/landing.module.css";

const IndexPage = () => (
  <>
    <SEO title="Home" />

    <div className={styles.p1}>
      <div className={styles.p1Content}>
        <h1>All your music, in one place.</h1>
        <Link to="/signup">Join For Free</Link>
      </div>
    </div>
  </>
);

export default IndexPage;
