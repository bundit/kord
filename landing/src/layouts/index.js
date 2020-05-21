import "aos/dist/aos.css";

import "../styles/global.css";

import AOS from "aos";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import Header from "../components/header";
import ParticlesContainer from "../components/particles-container";

const Layout = ({ children }) => {
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useAOS();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolledPast(window.pageYOffset >= 100);
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

function useAOS() {
  React.useEffect(() => {
    AOS.init({
      once: "true",
      offset: 200
    });
  }, []);
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
