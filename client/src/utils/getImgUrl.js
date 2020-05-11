import placeholderImg from "../assets/track-placeholder.png";

export function getImgUrl(track, size) {
  if (!track || !track.img) {
    return placeholderImg;
  }

  if (track.source === "soundcloud") {
    if (size === "sm") {
      return track.img.replace("large.jpg", "t67x67.jpg");
    }
    if (size === "md") {
      return track.img.replace("large.jpg", "t300x300.jpg");
    }
    if (size === "lg") {
      return track.img.replace("large.jpg", "t500x500.jpg");
    }
  } else if (track.source === "spotify") {
    if (!track.img.length) {
      return placeholderImg;
    }

    if (size === "sm") {
      return track.img[2].url;
    }
    if (size === "md") {
      return track.img[1].url;
    }
    if (size === "lg") {
      return track.img[0].url;
    }
  }
}
