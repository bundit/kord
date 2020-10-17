import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { saveRoute } from "../redux/actions/userActions";

const NavHistory = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useSelector(state => state.user.history);

  useEffect(() => {
    const { pathname } = location;
    const relativeRoute = pathname.split("/")[2]; // ["", "app", X, ...]
    const relativeRouteHistory = history[relativeRoute] || [];
    const prevRelativeRoute =
      relativeRouteHistory[0] || `/app/${relativeRoute}`;

    if (prevRelativeRoute === pathname) {
      // Mobile returning to tab, not navigating to new page
      return;
    }

    dispatch(saveRoute(relativeRoute, pathname));
  }, [dispatch, history, location]);

  return null;
};

export default NavHistory;
