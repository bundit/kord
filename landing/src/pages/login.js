import React from "react";
import LoginPanel from "../components/login-panel";
import styles from "../styles/landing.module.css";

const Login = () => (
  <>
    <div className={styles.p1}>
      <LoginPanel login />
    </div>
  </>
);

export default Login;
