import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import React from "react";

import { saveRoute, setCurrentPage } from "../redux/actions/userActions";

const NavHistory = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const { pathname } = location;
    const urlParams = pathname.split("/");

    const relativeRoute = urlParams[2];
    let lastParam = urlParams[urlParams.length - 1];

    if (relativeRoute === "search") {
      lastParam = relativeRoute;
    }

    dispatch(saveRoute(relativeRoute, pathname));
    dispatch(setCurrentPage(lastParam));
  }, [dispatch, location]);

  return null;
};

export default NavHistory;
