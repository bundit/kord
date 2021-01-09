import {
  faAngleLeft,
  faAngleRight,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useState } from "react";

import {
  IconButton as BackwardButton,
  IconButton as ForwardButton,
  IconButton,
  Button as UserSettingsButton
} from "../buttons";
import { clearState } from "../../redux/actions/stateActions";
import { dequeRoute, openSettings } from "../../redux/actions/userActions";
import { getTitleFromPathname } from "../../utils/formattingHelpers";
import Image from "../image";
import SearchBar from "../search-bar";
import avatarImg from "../../assets/avatar-placeholder.png";
import styles from "../../styles/header.module.scss";

function Header({ location }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const mainConnection = useSelector(state => state.user.kord.mainConnection);
  const mainUser =
    useSelector(state => state.user[mainConnection]) || "spotify";
  const dispatch = useDispatch();
  const history = useHistory();

  const { pathname } = location;
  const title = getTitleFromPathname(pathname);

  function handleGoBack() {
    history.goBack();
  }

  function handleGoForward() {
    history.goForward();
  }

  function handleOpenSettings() {
    dispatch(openSettings("kord"));
    setIsProfileDropdownOpen(false);
  }

  function toggleSettingsMenu() {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  }

  function handleLogout() {
    const confirm = window.confirm("Are you sure you want to log out?");
    const isProduction = process.env.NODE_ENV === "production";

    if (confirm) {
      localStorage.clear();
      dispatch(clearState());

      window.location.href = isProduction
        ? "/auth/logout"
        : "http://localhost:8888/auth/logout";
    }
  }

  return (
    <>
      <header className={styles.header}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <div className={`${styles.placeholder} ${styles.headerLeft}`}>
            <MobileBackButton pathname={pathname} />
          </div>
          <h1>{title.length ? decodeURIComponent(title) : "kord"}</h1>
          <div
            className={`${styles.placeholder} ${styles.headerRight}`}
            style={{ display: "flex" }}
          >
            <IconButton
              icon={faUser}
              style={{ fontSize: "25px", marginLeft: "auto" }}
              onClick={handleOpenSettings}
            />
          </div>
        </div>

        {/* Desktop Header */}
        <div className={styles.desktopHeader}>
          <div className={styles.backForwardNavigationWrapper}>
            <BackwardButton onClick={handleGoBack} icon={faAngleLeft} />
            <ForwardButton onClick={handleGoForward} icon={faAngleRight} />
          </div>

          <SearchBar placeholder="Search for Music" />

          <span className={styles.userSettingsButtonWrapper}>
            <UserSettingsButton
              className={styles.userSettingsButton}
              onClick={toggleSettingsMenu}
            >
              <Image
                src={mainUser.image || avatarImg}
                alt="profilePic"
                style={{
                  width: "inherit",
                  height: "inherit",
                  borderRadius: "50%"
                }}
              />
            </UserSettingsButton>

            {isProfileDropdownOpen && (
              <span className={styles.profileMenu}>
                <button type="button" onClick={handleOpenSettings}>
                  Settings
                </button>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </span>
            )}
          </span>
        </div>
      </header>
    </>
  );
}

function MobileBackButton({ pathname }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const userHistory = useSelector(state => state.user.history);

  const title = getTitleFromPathname(pathname);
  const baseUrls = ["Library", "Search", "Explore", ""];

  if (baseUrls.includes(title)) {
    return null;
  }

  const lastRoute = {
    library: userHistory.library[1] || "/app/library",
    search: userHistory.search[1] || "/app/search",
    explore: "/app/explore"
  };

  const relativeRoute = pathname.split("/")[2];

  function handleBackClick() {
    history.push(lastRoute[relativeRoute]);
    dispatch(dequeRoute(relativeRoute, pathname));
  }

  return <IconButton icon={faAngleLeft} onClick={handleBackClick} />;
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default Header;
