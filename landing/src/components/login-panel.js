import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import { faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import React from "react";

import Kord3D from "../assets/circle-logo.svg";
import styles from "../styles/login.module.css";
import useMobileDetection from "../utils/useMobileDetection";

const LoginPanel = ({ login }) => {
  const text = login ? "Log in" : "Sign up";
  const isMobile = useMobileDetection();

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://www.kord.app"
      : "http://localhost:8888";

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginHeaderWrapper}>
        <Link to="/">
          <h1>
            <Kord3D />
          </h1>
        </Link>
      </div>
      <hr />
      {isMobile ? (
        <>
          <h3>Thanks for checking us out!</h3>
          <div style={{ margin: "40px 0" }}>
            Mobile is not currently supported.
            <br />
            <em> Join us on desktop for the full experience!</em>
          </div>
        </>
      ) : (
        <h3>{`To continue, ${text.toLowerCase()} to Kord`}</h3>
      )}

      {!isMobile && (
        <>
          <div className={styles.loginListWrapper}>
            <a href={`${baseUrl}/auth/spotify`} className={styles.oAuthLink}>
              <span style={{ color: "#1DB954" }}>
                <FontAwesomeIcon icon={faSpotify} size="2x" />
              </span>
              <span>{`${text} with Spotify`}</span>
            </a>
            <a href={`${baseUrl}/auth/youtube`} className={styles.oAuthLink}>
              <span style={{ color: "red" }}>
                <FontAwesomeIcon icon={faYoutube} size="2x" />
              </span>
              <span>{`${text} with YouTube`}</span>
            </a>
          </div>
          <PrivacyPolicyAndTermsOfUse />
          {login ? (
            <span className={styles.otherPanelWrapper}>
              {"New here? "}
              <Link to="/signup" className={styles.link}>
                <strong>Sign Up</strong>
              </Link>
            </span>
          ) : (
            <span className={styles.otherPanelWrapper}>
              {"Already a member? "}
              <Link to="/login" className={styles.link}>
                Log In
              </Link>
            </span>
          )}
        </>
      )}
    </div>
  );
};

function PrivacyPolicyAndTermsOfUse() {
  return (
    <div style={{ fontSize: "10px", marginBottom: "10px" }}>
      {`Learn about how Kord collects, uses, shares and protects your personal
      data in our `}
      <Link to="/privacy" className={styles.link}>
        Privacy Policy
      </Link>
      {". By using our services, you agree to our "}
      <Link to="/terms-of-use" className={styles.link}>
        Terms of Use
      </Link>
      .
    </div>
  );
}

LoginPanel.propTypes = {
  login: PropTypes.bool.isRequired
};

export default LoginPanel;
