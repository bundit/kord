import {
  faSoundcloud,
  faSpotify,
  faYoutube,
  faMixcloud
} from "@fortawesome/free-brands-svg-icons";
import React from "react";

import { ReactComponent as KordLogo } from "../assets/kord-icon.svg";

export const SOURCES = ["spotify", "soundcloud", "youtube"]; //, "mixcloud"

export const ICONS = {
  kord: <KordLogo />,
  spotify: faSpotify,
  soundcloud: faSoundcloud,
  youtube: faYoutube,
  mixcloud: faMixcloud
};

export const COLORS = {
  kord: "#fb1",
  spotify: "#1db954",
  soundcloud: "#ff5500",
  youtube: "#ff0000",
  mixcloud: "#5000ff"
};
