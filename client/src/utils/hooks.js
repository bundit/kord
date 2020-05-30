import { useDispatch } from "react-redux";
import { useRef, useEffect, useState } from "react";
import raf from "raf";

import { fetchProfileAndPlaylists } from "../redux/actions/userActions";
import {
  nextTrack,
  pause,
  play,
  prevTrack,
  setDuration,
  setSeek
} from "../redux/actions/playerActions";
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

export function useSetDurationOnTrackChange(current) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSeek(0));
    dispatch(setDuration(Math.round(current.duration / 1000)));
  }, [current, dispatch]); // Song was changed
}

export function usePauseIfSdkNotReady(current, isPlaying, isSpotifySdkReady) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Prevent play if player is not ready
    if (current.source === "spotify") {
      if (isPlaying && !isSpotifySdkReady) {
        dispatch(pause());
      }
    }
  }, [isPlaying, current, isSpotifySdkReady, dispatch]);
}

export function useRenderSeekPosition(
  current,
  theRaf,
  renderSeekPos,
  isPlaying
) {
  useEffect(() => {
    raf.cancel(theRaf.current);

    if (isPlaying) {
      renderSeekPos();
    } else raf.cancel(theRaf.current);

    return () => raf.cancel(theRaf);
  }, [current, isPlaying, theRaf, renderSeekPos]); // Stop or start RAF when play/pause and song changes
}

export function useDetectMediaSession() {
  const dispatch = useDispatch();

  function handleNext() {
    dispatch(nextTrack());
  }

  function handlePause() {
    dispatch(pause());
  }

  function handlePlay() {
    dispatch(play());
  }

  function handlePrev() {
    dispatch(prevTrack());
  }

  useEffect(() => {
    const { mediaSession } = navigator;

    const events = {
      nexttrack: handleNext,
      pause: handlePause,
      play: handlePlay,
      previoustrack: handlePrev
    };

    if (mediaSession) {
      for (let evt of Object.keys(events)) {
        navigator.mediaSession.setActionHandler(evt, events[evt]);
      }
    }
    return () => {
      if (mediaSession) {
        for (let evt of Object.keys(events)) {
          navigator.mediaSession.setActionHandler(evt, null);
        }
      }
    }; //eslint-disable-next-line
  }, []);
}
