import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Header from "../components/header";
import ParticlesContainer from "../components/particles-container";
import "../components/styles/global.css";

const Layout = ({ children }) => {
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolledPast(window.pageYOffset >= window.innerHeight);
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <ParticlesContainer />
      <Header isScrolledPast={isScrolledPast} />
      <div>{children}</div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
