import "../components/styles/button-3d-round.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, navigate } from "gatsby";
import {
  faSpotify,
  faSoundcloud,
  faYoutube,
  faMixcloud
} from "@fortawesome/free-brands-svg-icons";
import React, { useState } from "react";

import SEO from "../components/seo";
import styles from "../components/styles/landing.module.css";

const IndexPage = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  function scrollListener() {
    setHasScrolled(true);
  }

  function handleTouchStart(e) {
    e.preventDefault();
    setHasScrolled(false);
    window.addEventListener("scroll", scrollListener);
  }

  function handleTouchEnd(e) {
    e.preventDefault();
    if (!hasScrolled) {
      setTimeout(() => navigate("/login"), 300);
    }
    window.removeEventListener("scroll", scrollListener);
  }

  const sourceTransitionDuration = "500";

  return (
    <>
      <SEO title="Home" />

      <div className={styles.p1} style={{ height: "auto" }}>
        <div className={styles.p1Content}>
          <h1
            className={styles.slogan}
            data-aos="fade-down"
            // data-aos-offset="200"
            data-aos-easing="ease-in-out-back"
            data-aos-duration="1200"
            data-aos-delay="100"
          >
            All your music, in one place.
          </h1>

          <Link
            to="/login"
            className="button nav-link"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <span
              data-aos="zoom-out"
              data-aos-easing="ease-out"
              data-aos-duration="200"
              data-aos-delay="1300"
            >
              <div className="bottom" />
            </span>

            <div
              className="top"
              data-aos="zoom-out"
              data-aos-easing="ease-out"
              data-aos-duration="300"
              data-aos-delay="1600"
            >
              <div className="label">Listen now</div>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.p2}>
        <div
          data-aos="zoom-out"
          data-aos-easing="ease-in-out-back"
          data-aos-duration="1000"
          data-aos-offset="300"
        >
          <h1>Already have playlists? No problem.</h1>
          <h3 className={styles.p2Blurb}>
            Connect your playlists from other major streaming platforms.
          </h3>
        </div>

        <div className={styles.sectionContainer}>
          <div className={`${styles.sourceCard} ${styles.spotify}`}>
            <div
              data-aos="fade-right"
              data-aos-easing="ease-in-out-back"
              // data-aos-offset="100"
              data-aos-duration={sourceTransitionDuration}
              data-aos-delay="800"
            >
              <FontAwesomeIcon icon={faSpotify} />
              <h3>Spotify</h3>
            </div>
          </div>
          <div className={`${styles.sourceCard} ${styles.soundcloud}`}>
            <div
              data-aos="fade-right"
              data-aos-easing="ease-in-out-back"
              data-aos-duration={sourceTransitionDuration}
              data-aos-delay="1100"
            >
              <FontAwesomeIcon icon={faSoundcloud} />
              <h3>Soundcloud</h3>
            </div>
          </div>
          <div className={`${styles.sourceCard} ${styles.youtube}`}>
            <div
              data-aos="fade-right"
              data-aos-easing="ease-in-out-back"
              data-aos-duration={sourceTransitionDuration}
              data-aos-delay="1400"
            >
              <FontAwesomeIcon icon={faYoutube} />
              <h3>Coming soon!</h3>
            </div>
          </div>
          <div className={`${styles.sourceCard} ${styles.mixcloud}`}>
            <div
              data-aos="fade-right"
              data-aos-easing="ease-in-out-back"
              data-aos-duration={sourceTransitionDuration}
              data-aos-delay="1700"
            >
              <FontAwesomeIcon icon={faMixcloud} />
              <h3>Coming soon!</h3>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.p1} style={{ height: "auto" }}>
        <div className={`${styles.p1Content} ${styles.p3Content}`}>
          <h1
            className={styles.slogan}
            style={{ marginTop: "20px" }}
            data-aos="fade-down"
            data-aos-easing="ease-in-out-back"
            data-aos-duration="1200"
          >
            Ready to start listening?
          </h1>
          <Link
            to="/login"
            className="button nav-link"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <span
              data-aos="zoom-out"
              data-aos-easing="ease-in"
              data-aos-duration="200"
              data-aos-offset="0"
              data-aos-delay="1000"
            >
              <div className="bottom" />
            </span>

            <div
              className="top"
              data-aos="zoom-out"
              data-aos-easing="ease-in"
              data-aos-duration="300"
              data-aos-offset="0"
              data-aos-delay="1600"
            >
              <div className="label">Listen now</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
