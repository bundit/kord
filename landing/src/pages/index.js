import React from "react";
import { Link } from "gatsby";
import SEO from "../components/seo";
import styles from "../components/styles/landing.module.css";
import "../components/styles/button-3d-round.css";

const IndexPage = () => (
  <>
    <SEO title="Home" />

    <div className={styles.p1}>
      <div className={styles.p1Content}>
        <h1>All your music, in one place.</h1>

        <Link to="/login" className="button nav-link">
          <div className="bottom" />

          <div className="top">
            <div className="label">Listen now</div>

            <div className="button-border button-border-left" />
            <div className="button-border button-border-top" />
            <div className="button-border button-border-right" />
            <div className="button-border button-border-bottom" />
          </div>
        </Link>
      </div>
    </div>
  </>
);

export default IndexPage;
