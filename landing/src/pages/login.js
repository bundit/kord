import React from "react";
import LoginPanel from "../components/login-panel";
import styles from "../components/styles/landing.module.css";

const Login = () => (
  <>
    <div className={styles.p1}>
      <LoginPanel />
    </div>
  </>
);

export default Login;
