import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import DoubleIcon from "../images/svg/logo-cartoon-no-white.svg";

import styles from "./styles/login.module.css";

const LoginPanel = () => (
  <div className={styles.loginWrapper}>
    <div className={styles.loginHeaderWrapper}>
      <span>
        <linearGradient id="MyGradient">
          <stop offset="5%" stopColor="#F60" />
          <DoubleIcon />
          <stop offset="95%" stopColor="#FF6" />
        </linearGradient>
      </span>
      <h1>kord</h1>
    </div>
    <hr />
    <h3>To continue, log in to kord</h3>
    <div className={styles.loginListWrapper}>
      <a href="/auth/spotify">
        <span style={{ color: "#1DB954" }}>
          <FontAwesomeIcon icon={faSpotify} size="3x" />
        </span>
        <span style={{}}>Log in with Spotify</span>
      </a>
      <a href="/auth/spotify">
        <span style={{ color: "red" }}>
          <FontAwesomeIcon icon={faYoutube} size="3x" />
        </span>
        <span>Log in with Youtube</span>
      </a>
    </div>
  </div>
);

export default LoginPanel;
