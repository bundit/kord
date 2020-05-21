import { useDispatch } from "react-redux";
import { useRef, useEffect, useState } from "react";

import { fetchProfileAndPlaylists } from "../redux/actions/userActions";
import { setSpotifyAccessToken } from "../redux/actions/spotifyActions";

export function useHashParamDetectionOnLoad() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.location.hash) {
      // Get hash params excluding first #
      const URLParams = new URLSearchParams(window.location.hash.substr(1));
      const source = URLParams.get("source");

      if (source === "spotify") {
        const spotifyToken = URLParams.get("spotifyToken");
        dispatch(setSpotifyAccessToken(spotifyToken));
        dispatch(fetchProfileAndPlaylists("spotify")).catch(e => {
          console.error(`There was an error: ${e.status}`);
        });
      }
    } // eslint-disable-next-line
  }, []);
}

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  function handleResize() {
    setIsMobile(window.innerWidth < 800);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
