import {
  LargePlayPauseButton,
  LargeIconButton as StarPlaylistButton,
  LargeIconButton as SyncButton
} from "./buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faSync,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

import { capitalizeWord } from "../utils/formattingHelpers";
import Image from "./image";
import styles from "../styles/page-header.module.scss";

const PageHeader = ({
  imgSrc,
  title,
  titleHref,
  imgBorderRadius,
  isStarred,
  handleStar,
  hasRefreshed,
  handleRefresh,
  thisPageIsPlaying,
  handlePlayPause,
  lastSynced,
  canPlay = true,
  children
}) => {
  return (
    <div className={styles.pageHeader}>
      <Image
        src={imgSrc}
        alt={`${title}-pic`}
        className={styles.pageHeaderImage}
        style={{ borderRadius: imgBorderRadius }}
      />

      <div className={styles.titleWrapper}>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <h2
            className={styles.headerTitle}
            style={{ paddingLeft: 0, marginTop: "0px" }}
          >
            {titleHref ? (
              <a href={titleHref} target="_blank" rel="noopener noreferrer">
                {capitalizeWord(decodeURIComponent(title))}
                <span style={{ marginLeft: "5px" }}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
                </span>
              </a>
            ) : (
              capitalizeWord(decodeURIComponent(title))
            )}
          </h2>

          {handleStar && (
            <StarPlaylistButton
              onClick={handleStar}
              icon={faStar}
              size="2x"
              style={{
                color: isStarred ? "#ffc842" : null,
                margin: "0 10px 0 auto"
              }}
            />
          )}
          {handleRefresh && (
            <SyncButton
              icon={faSync}
              onClick={handleRefresh}
              disabled={hasRefreshed}
              style={{ borderColor: "#383f41" }}
            />
          )}
        </div>

        {children}

        {canPlay && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginTop: "auto"
            }}
          >
            <LargePlayPauseButton
              isPlaying={thisPageIsPlaying}
              onClick={handlePlayPause}
            />

            {lastSynced && (
              <div style={{ marginLeft: "auto" }}>
                Last synced: {lastSynced}{" "}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
