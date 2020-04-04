import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { importSavedSpotifyTracks } from "../redux/actions/spotifyActions";
import { setAccessToken } from "../redux/actions/userActions";

export function useAutoRefreshTokens(user) {
  const dispatch = useDispatch();
  const ms = 1000 * 60 * 56;

  useEffect(() => {
    let timer;
    const source = "spotify";
    if (user.spotify.isConnected) {
      const makeRequest = function() {
        fetch(`/auth/${source}/refresh`)
          .then(res => res.json())
          .then(obj => {
            dispatch(setAccessToken(source, obj.accessToken));
          });
        timer = setTimeout(makeRequest, ms);
      };
      makeRequest();
    }
    return () => clearTimeout(timer);
  }, [user.spotify.isConnected]);

  // More refreshers go here
}

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
