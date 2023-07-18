import React from "react";

import LoginPanel from "../components/login-panel";
import SEO from "../components/seo";
import * as styles from "../styles/landing.module.css";

const SignUp = () => (
  <>
    <SEO title="Signup" />
    <div className={styles.p1}>
      <LoginPanel login={false} />
    </div>
  </>
);

export default SignUp;
