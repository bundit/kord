import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import React from "react";

import { saveRoute } from "../redux/actions/userActions";

const NavHistory = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const { pathname } = location;
    const relativeRoute = pathname.split("/")[2];

    dispatch(saveRoute(relativeRoute, pathname));
  }, [dispatch, location]);

  return null;
};

export default NavHistory;
