import PropTypes from "prop-types";
import React from "react";

import termsOfUse from "../assets/raw-terms-of-use";
import SEO from "../components/seo";
import * as styles from "../styles/landing.module.css";

const urlRegex =
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/gim;

const TermsOfUse = () => (
  <>
    <SEO title="Terms of Use" />
    <div className={styles.p1} style={{ height: "auto" }}>
      <div className={styles.p1Content}>
        <h1 className={styles.slogan}>Terms of Use</h1>
        <p>{termsOfUse.lastUpdated}</p>
      </div>

      <div
        className={styles.p2}
        style={{
          textAlign: "left",
          padding: "20px",
          boxSizing: "border-box"
        }}
      >
        {termsOfUse.text.split("\n").map((rawLine, i) => {
          const line = rawLine.trim();
          // Empty line
          if (!line.length) {
            return <React.Fragment key={i.toString()} />;
          }

          // Header
          if (line === line.toUpperCase()) {
            if (line.length > 100) {
              return (
                <p key={line}>
                  <strong>{line}</strong>
                </p>
              );
            }

            return (
              <h3
                id={line === "YOUTUBE TERMS OF USE" ? "youtube" : null}
                key={line}
              >
                {line}
              </h3>
            );
          }

          if (line.match(urlRegex)) {
            return <ParagraphWithLinks key={line} line={line} />;
          }

          return <p key={line}>{line}</p>;
        })}
      </div>
    </div>
  </>
);

function ParagraphWithLinks({ line }) {
  const urls = line.match(urlRegex);
  const text = line.split(urlRegex).filter((str) => str !== "");
  const components = [];

  while (text.length || urls.length) {
    if (text.length) {
      const textLine = text.shift();
      components.push(<span key={textLine}>{textLine}</span>);
    }

    if (urls.length) {
      const anchorUrl = urls.shift();
      components.push(
        <a key={anchorUrl} href={anchorUrl}>
          {anchorUrl}
        </a>
      );
    }
  }

  return <p>{components}</p>;
}

ParagraphWithLinks.propTypes = { line: PropTypes.string.isRequired };

export default TermsOfUse;
