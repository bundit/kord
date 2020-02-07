import React, { useState, useEffect } from "react";
import Particles from "react-particles-js";
import styles from "../styles/landing.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSoundcloud,
  faSpotify,
  faYoutube,
  faMixcloud
} from "@fortawesome/free-brands-svg-icons";

const LandingPage = () => {
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = e => {
      setIsScrolledPast(window.pageYOffset >= window.innerHeight);
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <main className={styles.main}>
        <header
          className={`${styles.header} ${
            isScrolledPast ? styles.headerScrolled : null
          }`}
        >
          <div className={styles.headerContainer}>
            <a href="/">
              <h2>kord</h2>
            </a>
            <div className={styles.headerLinks}>
              <a href="/signup">Sign Up</a>
              <a href="/login">Log In</a>
            </div>
          </div>
        </header>

        <div className={styles.p1}>
          <div className={styles.p1Content}>
            <h1>All your music, in one place.</h1>
            <a href="/signup">Join For Free</a>
          </div>
        </div>

        <div className={styles.contentContainer}>
          <p style={{ fontSize: "40px", width: "80%", margin: "auto" }}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            dolorum ab commodi animi, ipsa vitae ut et totam, neque, labore amet
            nihil natus quia unde in itaque quod autem a cumque ipsum minima.
            Alias facere temporibus, odio quaerat cum iste perferendis
            voluptates voluptas minima ipsa delectus consectetur nam, quod.
            Ullam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Consectetur excepturi tempore, minima maiores porro quod
            praesentium, beatae odit natus voluptates quibusdam blanditiis sequi
            aspernatur non eius ut illo placeat at architecto ab saepe.
            Reprehenderit nobis totam numquam optio dolores amet dignissimos
            reiciendis velit, similique perferendis voluptatem eum quisquam,
            voluptas doloremque ipsum hic nihil cum soluta provident eveniet
            sunt architecto excepturi voluptates. In dignissimos asperiores ut
            neque porro qui praesentium incidunt mollitia eveniet excepturi!
            Culpa accusamus debitis adipisci! Voluptatibus distinctio aliquam
            rem, quibusdam quas et, sapiente corporis perferendis in, asperiores
            dolores fugiat ex repellat nemo. Maxime, labore cumque sed magnam
            asperiores.
          </p>
          <div className={styles.brandGroup}>
            <FontAwesomeIcon icon={faSoundcloud} size="5x" />
            <FontAwesomeIcon icon={faSpotify} size="5x" />
            <FontAwesomeIcon icon={faYoutube} size="5x" />
            <FontAwesomeIcon icon={faMixcloud} size="5x" />
          </div>
        </div>
      </main>

      <Particles
        className={styles.particleCanvas}
        params={{
          particles: {
            number: {
              value: 150
            },
            color: {
              value: "#fff"
            },
            // shape: {
            //   type: "circle",
            //   stroke: {
            //     width: 0,
            //     color: "#000000"
            //   }
            // },
            size: {
              value: 2,
              random: true
            },
            opacity: {
              value: 0.9,
              random: true
            },
            line_linked: {
              enable_auto: true,
              // distance: 100,
              color: "#fff",
              opacity: 0.4,
              width: 1.5
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "grab"
              },
              onclick: {
                enable: true,
                mode: "push"
              }
            },
            modes: {
              grab: {
                line_linked: {
                  opacity: 0.7
                }
                // distance: 1000
              }
            },
            detect_on: "window"
          }
        }}
      />
    </>
  );
};

export default LandingPage;
