import React from "react";
import LoginPanel from "../components/login-panel";
import styles from "../components/styles/landing.module.css";

const SignUp = () => (
  <>
    <div className={styles.p1}>
      <LoginPanel login={false} />
    </div>
  </>
);

export default SignUp;
