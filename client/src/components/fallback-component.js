import React from "react";

const FallbackComponent = () => {
  return (
    <div
      style={{
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "red",
        height: "100%",
        width: "100%",
        background: "rgba(255,0,0,0.2)"
      }}
    >
      <h2>Ruh roh, something went wrong.</h2>
    </div>
  );
};

export default FallbackComponent;
