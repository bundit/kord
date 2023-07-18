import "../styles/button-3d-round.css";

import {
  faMixcloud,
  faSoundcloud,
  faSpotify,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, navigate } from "gatsby";
import React, { useState } from "react";

import ArtistMockup from "../assets/mockup-artist.jpg";
import SearchMockup from "../assets/mockup-search.jpg";
import SEO from "../components/seo";
import * as styles from "../styles/landing.module.css";
import { useAuthDetection } from "../utils/auth-provider";

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

  const appUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.kord.app"
      : "http://localhost:3000";

  const serverUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.kord.app"
      : "http://localhost:8888";

  const textCTA = isLoggedIn ? "Open Player" : "Join now";
  const linkCTA = isLoggedIn ? `${appUrl}/app/library` : "/login";

  const sourceCards = [
    {
      source: "spotify",
      text: "Spotify",
      icon: faSpotify,
      delay: 500,
      loginHref: `${serverUrl}/auth/spotify`
    },
    {
      source: "soundcloud",
      text: "Soundcloud",
      icon: faSoundcloud,
      delay: 700
    },
    {
      source: "youtube",
      text: "YouTube",
      icon: faYoutube,
      delay: 900,
      loginHref: `${serverUrl}/auth/youtube`
    },
    { source: "mixcloud", text: "Coming Soon!", icon: faMixcloud, delay: 1100 }
  ];

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

      <div className={styles.p2Wrapper}>
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
            {sourceCards.map((card) => (
              <div
                className={`${styles.sourceCard} ${styles[card.source]}`}
                key={`${card.source}:card`}
              >
                <div
                  data-aos="fade-right"
                  data-aos-easing="ease-in-out-back"
                  data-aos-duration={sourceTransitionDuration}
                  data-aos-delay={card.delay}
                >
                  <FontAwesomeIcon icon={card.icon} />
                  <h3>{card.text}</h3>
                </div>
                {card.loginHref ? (
                  <a href={card.loginHref}>
                    <span>Get Started</span>
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.p2}>
          <div
            data-aos="zoom-out"
            data-aos-easing="ease-in-out-back"
            data-aos-duration="1000"
            data-aos-offset="200"
          >
            <h1>Experience your music from any computer</h1>
            <h3 className={styles.p2Blurb}>
              Easily browse your saved online music from all platforms in one
              place on your desktop, laptop, or work computer.
            </h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "0 50px"
            }}
          >
            <div
              data-aos="fade-right"
              data-aos-easing="ease-in-out-back"
              data-aos-duration="1000"
              data-aos-offset="300"
            >
              <img
                className={styles.mockupImg}
                src={ArtistMockup}
                alt="artist-mockup"
              />
              <h3 className={styles.p2Blurb}>
                Google Chrome and Mozilla Firefox supported.
              </h3>
            </div>
          </div>
        </div>
        <div className={styles.p2}>
          <div
            data-aos="zoom-out"
            data-aos-easing="ease-in-out-back"
            data-aos-duration="1000"
            data-aos-offset="200"
          >
            <h1>Search across platforms in an instant</h1>
            <h3 className={styles.p2Blurb}>
              Couldn&apos;t find the song you&apos;re looking for? No need to
              switch websites.
            </h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "0 50px"
            }}
          >
            <div
              data-aos="fade-left"
              data-aos-easing="ease-in-out-back"
              data-aos-duration="1000"
              data-aos-offset="300"
            >
              <img
                className={styles.mockupImg}
                src={SearchMockup}
                alt="artist-mockup"
              />
            </div>
          </div>
        </div>

        <div className={styles.p2}>
          <div
            data-aos="zoom-out"
            data-aos-easing="ease-in-out-back"
            data-aos-duration="1000"
            data-aos-offset="200"
          >
            <h1>Still not interested?</h1>
            <h3 className={styles.p2Blurb}>Check out Kord in our demo video</h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "0 50px"
            }}
          >
            <div className={styles.demoWrapper}>
              <iframe
                src="https://player.vimeo.com/video/514566587?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="kord-demo.mp4"
              />
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
