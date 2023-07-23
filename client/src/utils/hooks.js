import Cookies from "js-cookie";
import raf from "raf";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchUserPlaylists } from "../redux/actions/libraryActions";
import {
  nextTrack,
  pause,
  play,
  prevTrack,
  setDuration,
  setSeek
} from "../redux/actions/playerActions";
import {
  fetchProfileAndPlaylists,
  fetchUserProfiles,
  setAccessToken,
  setConnection,
  setKordId,
  setMainConnection,
  setShowUnsupportedBrowserModal
} from "../redux/actions/userActions";
import { fetchGeneric } from "./fetchGeneric";
import {
  capitalizeWord,
  formatArtistName,
  getTitleFromPathname
} from "./formattingHelpers";

export function useLoadUserDataOnMount(setIsLoadingUserData) {
  const mainConnection = useSelector((state) => state.user.kord.mainConnection);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {
    window.addEventListener("beforeunload", setCookieOnUnload);
    return () => {
      window.removeEventListener("beforeunload", setCookieOnUnload);
    };
  }, []);

  const setCookieOnUnload = (e) => {
    Cookies.set("userBackUnderOneHour", "true", {
      expires: 1 / 24
    });
  };

  useEffect(() => {
    const userBackUnderOneHour = Cookies.get("userBackUnderOneHour");
    if (window.location.hash || !userBackUnderOneHour) {
      setIsLoadingUserData(true);

      dispatch(refreshUserData(alert))
        .then(() => dispatch(handleHashParams(navigate, mainConnection, alert)))
        .finally(() => setTimeout(() => setIsLoadingUserData(false), 600));
    } else {
      setIsLoadingUserData(false);
    } // eslint-disable-next-line
  }, []);
}

const refreshUserData = (alert) => (dispatch) => {
  const userBackUnderOneHour = Cookies.get("userBackUnderOneHour");

  if (!userBackUnderOneHour) {
    return Promise.all([
      dispatch(fetchUserProfiles()).catch((e) =>
        alert.error("Unable to restore profiles")
      ),
      dispatch(fetchUserPlaylists()).catch((e) =>
        alert.error("Unable to restore playlists")
      )
    ]);
  }

  return Promise.resolve();
};

const handleHashParams = (navigate, mainConnection, alert) => (dispatch) => {
  if (window.location.hash) {
    // Get hash params excluding first #
    const URLParams = new URLSearchParams(window.location.hash.substr(1));
    const accessToken = URLParams.get("accessToken");
    const source = URLParams.get("source");
    const userId = URLParams.get("userId");

    if (userId) {
      dispatch(setKordId(userId));
    }

    if (source) {
      if (accessToken) {
        dispatch(setAccessToken(source, accessToken));
        dispatch(setConnection(source, true));
      }

      if (!mainConnection) {
        dispatch(setMainConnection(source));
      }

      return dispatch(fetchProfileAndPlaylists(source))
        .catch((e) => alert.error("Connect account failed"))
        .finally(() => navigate(window.location.pathname));
    }
  }

  return Promise.resolve();
};

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

export function useKeepSessionAlive() {
  const timer = useRef(null);

  function refreshUserCookie() {
    fetchGeneric("/auth/token").catch((e) => {
      if (e.status === 403 || e.status === 401) {
        window.location = "/login";
      }
    });
  }

  function clearInterval() {
    clearTimeout(timer.current);
  }

  useEffect(() => {
    const oneHour = 1000 * 60 * 60;
    timer.current = setInterval(refreshUserCookie, oneHour);

    return clearInterval;
  }, []);
}

const controlList = [
  " ",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "f",
  "m",
  "q",
  "h",
  "Shift"
];

const keysPressed = {};

export function useKeyControls(handleKeyControls) {
  useEffect(() => {
    window.onkeydown = (e) => {
      const { key } = e;
      const searchBar = document.getElementById("search-bar");
      const soundcloudUrlInput = document.getElementById("soundcloudURL");
      const activeElement = document.activeElement;

      if (keysPressed["Meta"] || keysPressed["Control"]) {
        delete keysPressed["Meta"];
        delete keysPressed["Control"];
        return;
      }

      if (searchBar === activeElement || soundcloudUrlInput === activeElement) {
        return;
      }

      if (controlList.includes(key)) {
        e.preventDefault();
      }

      if (keysPressed[key] && key !== "Shift") {
        // Prevent holding down key rapid fire
        return;
      }

      keysPressed[key] = true;

      handleKeyControls(key, keysPressed["Shift"]);
    };

    window.onkeyup = (e) => {
      delete keysPressed[e.key];
    };
  }, [handleKeyControls]);
}

export function useSetDocumentTitle() {
  const { pathname } = useLocation();
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const currentTrack = useSelector((state) => state.player.currentTrack);
  const currentPage = decodeURIComponent(getTitleFromPathname(pathname));

  useEffect(() => {
    if (isPlaying) {
      document.title = `${currentTrack.title} ◦ ${formatArtistName(
        currentTrack.artist
      )}`;
    } else {
      document.title = `Kord | ${capitalizeWord(currentPage)}`;
    }
  }, [currentPage, currentTrack, isPlaying]);
}

export function useClearSessionStorageOnRefresh() {
  useEffect(() => {
    window.onbeforeunload = function (e) {
      sessionStorage.clear();

      e.preventDefault();
    };
  }, []);
}

export function usePortal(id) {
  /**
   * Creates DOM element to be used as React root.
   * @returns {HTMLElement}
   */
  function createRootElement(id) {
    const rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", id);
    return rootContainer;
  }

  /**
   * Appends element as last child of body.
   * @param {HTMLElement} rootElem
   */
  function addRootElement(rootElem) {
    document.body.insertBefore(
      rootElem,
      document.body.lastElementChild.nextElementSibling
    );
  }

  const rootElemRef = useRef(null);

  useEffect(function setupElement() {
    // Look for existing target dom element to append to
    const existingParent = document.querySelector(`#${id}`);
    // Parent is either a new root or the existing dom element
    const parentElem = existingParent || createRootElement(id);

    // If there is no existing DOM element, add a new one.
    if (!existingParent) {
      addRootElement(parentElem);
    }

    // Add the detached element to the parent
    parentElem.appendChild(rootElemRef.current);

    return function removeElement() {
      rootElemRef.current.remove();
      if (parentElem.childNodes.length === -1) {
        parentElem.remove();
      }
      // componentDidMount
    }; // eslint-disable-next-line
  }, []);

  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement("div");
    }
    return rootElemRef.current;
  }

  return getRootElem();
}

// https://www.radiantmediaplayer.com/blog/detecting-eme-cdm-browser.html
export function useDetectWidevine() {
  const dispatch = useDispatch();

  const config = [
    {
      initDataTypes: ["cenc"],
      audioCapabilities: [
        {
          contentType: 'audio/mp4;codecs="mp4a.40.2"'
        }
      ]
    }
  ];

  useEffect(() => {
    function handleWidevineNotSupported() {
      const disablePrompt = localStorage.getItem("disablePrompt") === "true";

      if (!disablePrompt) {
        dispatch(setShowUnsupportedBrowserModal(true));
      }
    }

    try {
      navigator
        .requestMediaKeySystemAccess("com.widevine.alpha", config)
        .then(function (mediaKeySystemAccess) {
          // Widevine support OK
        })
        .catch(function (e) {
          // Widevine NOT supported
          handleWidevineNotSupported();
        });
    } catch (e) {
      // Widevine NOT supported
      handleWidevineNotSupported();
    } // eslint-disable-next-line
  }, []);
}
