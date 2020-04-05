import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { importSavedSpotifyTracks } from "../redux/actions/spotifyActions";
import { setAccessToken } from "../redux/actions/userActions";

export function useHashParamDetectionOnLoad() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.location.hash) {
      // Get hash params excluding first #
      const URLParams = new URLSearchParams(window.location.hash.substr(1));
      const source = URLParams.get("source");

      if (source === "spotify") {
        const spotifyToken = URLParams.get("spotifyToken");
        dispatch(setAccessToken("spotify", spotifyToken));
        // setSpotifyAccessToken(accessToken);

        dispatch(importSavedSpotifyTracks());
      }
    }
  }, [dispatch]);
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
