import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

const NavHistory = ({ pushLibRoute }) => {
  const location = useLocation();

  React.useEffect(() => {
    const { pathname } = location;
    const rootRelativeURL = pathname.split("/")[1];

    if (rootRelativeURL === "library") {
      pushLibRoute(pathname);
    } else if (rootRelativeURL === "search") {
      // Placeholder
    } else if (rootRelativeURL === "more") {
      // Placeholder
    }
  }, [pushLibRoute, location]);

  return null;
};

NavHistory.propTypes = {
  pushLibRoute: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  pushLibRoute: route =>
    dispatch({
      type: "PUSH_LIB_ROUTE",
      payload: route
    })
});

export default connect(
  null,
  mapDispatchToProps
)(NavHistory);
