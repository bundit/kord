import React from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

// window.addEventListener("load", event => {});
let numParticles = 150;

if (process.env.NODE_ENV !== "development" && typeof window !== "undefined") {
  const { innerWidth: width, innerHeight: height } = window;
  const divisor = 10000;

  numParticles = (width * height) / divisor;
}

const particleParams = {
  particles: {
    number: {
      density: {
        enable: true
        // area: 800
      },
      value: numParticles
    },
    color: {
      value: "#fff"
    },
    // shape: {
    //   type: "circle",
    //   stroke: {
    //     width: 1,
    //     color: "#fff"
    //   }
    // },
    // line_linked: {
    //   enable: true,
    //   distance: 150,
    //   color: "random",
    //   opacity: 0.4,
    //   width: 1,
    //   triangles: {
    //     enable: true,
    //     color: "#ffffff",
    //     opacity: 0.1
    //   }
    // },
    size: {
      value: 3,
      random: true
    },
    opacity: {
      value: 0.9,
      random: true
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.7,
      width: 1.5
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      },
      outModes: {
        default: "bounce"
      }
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "link"
      },
      onclick: {
        enable: true,
        mode: "push"
      }
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 0.7
        }
        // distance: 1000
      }
    },
    detect_on: "window"
  }
};

function ParticlesContainer() {
  async function initParticles(engine) {
    await loadSlim(engine);
  }

  return (
    <div
      style={{
        position: "fixed",
        background:
          "linear-gradient(0deg, rgba(255,187,17,1) 0%, rgba(255,200,66,1) 100%)",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
      }}
      data-aos="zoom-out"
      data-aos-duration="1500"
    >
      <Particles
        id="tsparticles"
        style={{ position: "absolute" }}
        init={initParticles}
        options={particleParams}
      />
    </div>
  );
}

export default ParticlesContainer;
