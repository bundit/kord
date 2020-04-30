import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/library.module.css";
import sidebarStyles from "../styles/sidebar.module.css";

const PlaylistItem = ({ title, source, id, sidebar }) => (
  <NavLink
    to={`/app/library/playlists/${source}/${id}/${title}`}
    className={sidebar ? sidebarStyles.sidebarNavLink : styles.trackWrapper}
    activeClassName={sidebar && sidebarStyles.activeNavLink}
  >
    <div className={styles.titleWrapper}>
      <div>{title}</div>
    </div>
    <div
      style={{
        marginLeft: "auto",
        display: "inherit",
        flexDirection: "inherit"
      }}
    >
      {!sidebar && (
        <>
          <button type="button" onClick={e => e.preventDefault()}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </>
      )}
    </div>
  </NavLink>
);

PlaylistItem.propTypes = {
  title: PropTypes.string.isRequired
};

export default PlaylistItem;
