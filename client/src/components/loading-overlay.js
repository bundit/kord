import React from "react";

import Backdrop from "./backdrop";
import LoadingSpinner from "./loading-spinner";

const LoadingOverlay = ({ show }) => {
  return (
    <Backdrop show={show}>
      <span style={{ margin: "0 auto" }}>
        <LoadingSpinner />
      </span>
    </Backdrop>
  );
};

export default LoadingOverlay;
