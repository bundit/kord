import "../styles/button-3d-round.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, navigate } from "gatsby";
import {
  faSpotify,
  faSoundcloud,
  faYoutube,
  faMixcloud
} from "@fortawesome/free-brands-svg-icons";
import React, { useState } from "react";

import { useAuthDetection } from "../utils/auth-provider";
import SEO from "../components/seo";
import styles from "../styles/landing.module.css";

const IndexPage = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const isLoggedIn = useAuthDetection();

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

  const sourceTransitionDuration = "400";

  const textCTA = isLoggedIn ? "Open Player" : "Join now";
  const linkCTA = isLoggedIn ? "/app/library" : "/login";

  return (
    <>
      <SEO title="Music from everywhere" />

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

          {isLoggedIn ? (
            <a
              href={linkCTA}
              className="button nav-link"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <CTA textCTA={textCTA} />
            </a>
          ) : (
            <Link
              to={linkCTA}
              className="button nav-link"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <CTA textCTA={textCTA} />
            </Link>
          )}
        </div>
      </div>
      <div className={styles.p2}>
        <div
          data-aos="zoom-out"
          data-aos-easing="ease-in-out-back"
          data-aos-duration="1000"
          data-aos-offset="200"
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
              data-aos-duration={sourceTransitionDuration}
              // data-aos-delay="800"
              data-aos-delay="500"
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
              // data-aos-delay="1100"
              data-aos-delay="700"
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
              // data-aos-delay="1400"
              data-aos-delay="900"
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
              // data-aos-delay="1700"
              data-aos-delay="1100"
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
            data-aos-duration="1000"
          >
            Ready to start listening?
          </h1>

          {isLoggedIn ? (
            <a
              href={linkCTA}
              className="button nav-link"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <CTA textCTA={textCTA} />
            </a>
          ) : (
            <Link
              to={linkCTA}
              className="button nav-link"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <CTA textCTA={textCTA} />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

function CTA({ textCTA }) {
  return (
    <>
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
        data-aos-delay="1400"
      >
        <div className="label">{textCTA}</div>
      </div>
    </>
  );
}

export default IndexPage;
