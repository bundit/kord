import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

import { refreshSpotifyToken } from "../redux/actions/spotifyActions";
import { usePrevious } from "../utils/hooks";

const SpotifyPlayer = ({
  forwardRef,
  playerName,
  track,
  isPlaying,
  onReady,
  onNotReady,
  onEnd,
  onAccountError,
  volume,
  controls
}) => {
  const dispatch = useDispatch();
  const player = useRef(null);
  const history = useHistory();

  useSpotifyWebPlaybackSdkScript();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      function fetchToken() {
        return dispatch(refreshSpotifyToken()).catch(e => {
          if (e.status === 401) {
            history.push("/login");
          }
        });
      }

      if (!player.current) {
        player.current = new SpotifyWebPlaybackSdk(
          playerName,
          fetchToken,
          volume
        );

        player.current.onTrackEnd = onEnd;
        player.current.onReady = onReady;
        player.current.onNotReady = onNotReady;
        player.current.onAccountError = onAccountError;
        player.current.controls = controls;

        player.current.initPlayer();

        if (forwardRef) {
          forwardRef.current = player.current;
        }
      }
    };
    return () => {
      if (player.current) {
        player.current.disconnectPlayer();
      }
      // componentDidMount
    }; // eslint-disable-next-line
  }, []);

  const prevTrack = usePrevious(track);

  useEffect(() => {
    const spotifyPlayer = player.current;

    if (!spotifyPlayer) return;

    const trackHasChanged = prevTrack !== track;
    const trackHasLoaded = spotifyPlayer.isLoaded;
    const isSpotifyTrack = track.source === "spotify";

    if (!isSpotifyTrack) {
      spotifyPlayer.disconnectPlayer();
      return;
    }

    spotifyPlayer.isPlaying = isPlaying;

    if (isPlaying) {
      if (trackHasChanged) {
        // Is playing and track changed, load new song
        spotifyPlayer.load(track.id);
      } else {
        if (trackHasLoaded) {
          // Is playing but track already loaded, resume playing
          spotifyPlayer.play();
        } else {
          // Is playing but hasn't loaded, load the new track
          spotifyPlayer.load(track.id);
        }
      }
    } else {
      spotifyPlayer.pause();
      if (trackHasChanged) {
        // Isn't playing but track has changed, set isLoaded to false
        spotifyPlayer.isLoaded = false;
      } else {
        // Track hasnt changed, just pause
      }
    } // eslint-disable-next-line
  }, [track, isPlaying]);

  useEffect(() => {
    if (player.current) {
      player.current.setVolume(volume);
    }
  }, [volume]);

  return <React.Fragment />;
};

function useSpotifyWebPlaybackSdkScript() {
  useEffect(() => {
    if (!window.Spotify) {
      appendSpotifySdkScriptToDOM();
    }
  }, []);
}

class SpotifyWebPlaybackSdk {
  constructor(playerName, fetchToken, volume) {
    this.playerName = playerName;
    this.fetchToken = fetchToken;
    this.volume = volume;
    this.accessToken = null;

    this.deviceId = null;
    this.timer = null;

    this.fetchAndSetToken = this.fetchAndSetToken.bind(this);
    this.load = this.load.bind(this);
  }

  initPlayer() {
    if (!this.player) {
      this.player = new window.Spotify.Player({
        name: this.playerName,
        getOAuthToken: this.fetchAndSetToken,
        volume: this.volume || 1
      });

      this.addListeners();
    }

    return this.player.connect();
  }

  disconnectPlayer() {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
    }
  }

  fetchAndSetToken(cb) {
    return this.fetchToken()
      .then(token => {
        this.setAccessToken(token);
        if (cb) cb(token);
      })
      .catch(e => console.error(`Error refreshing spotify player ${e}`));
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  load(trackId, positionMs = 0, tries = 3) {
    this.isLoaded = false;
    this.currentTrack = trackId;

    if (!tries) {
      return console.error(`Couldn't load track ${trackId}`);
    }

    if (this.player && this.deviceId) {
      return this.loadTrackToPlayer(trackId, positionMs).then(res => {
        if (res.status === 401) {
          // Expired token
          return this.fetchAndSetToken().then(() =>
            this.load(trackId, positionMs, --tries)
          );
        } else if (res.status === 403) {
          return this.handleAccountError();
        } else if (res.status === 404) {
          console.log("error 404 on track PUT, trying to reinitialize");
          this.disconnectPlayer();

          return this.initPlayer().then(() => {
            console.log("Spoitfy player reinitialized");
            return this.load(trackId, positionMs, --tries);
          });
        }

        this.isLoaded = true;
        this.progressMs = 0;
        this.trackSeekPosition();
      });
    } else {
      this.queuedTrack = trackId;

      return this.initPlayer();
    }
  }

  loadTrackToPlayer(trackId, positionMs = 0) {
    return fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`],
          position_ms: positionMs
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        }
      }
    );
  }

  play(tries = 3) {
    if (!this.isLoaded) return;

    if (!tries) {
      return console.error(`Error playing spotify track`);
    }

    if (this.player && this.deviceId) {
      this.player.resume();
      this.trackSeekPosition();
    } else {
      setTimeout(() => this.play(--tries), 300);
    }
  }

  pause(tries = 3) {
    if (!this.isLoaded) return;

    if (!tries) {
      return console.error(`Error pausing spotify track`);
    }

    if (this.player) {
      this.player.pause();
      this.stopTrackingSeekPosition();
    } else {
      setTimeout(() => this.pause(--tries), 300);
    }
  }

  seek(position) {
    if (!this.isLoaded) return;

    if (!position && position !== 0) {
      return this.progressMs;
    }

    if (this.player) {
      this.player.seek(position);
    } else {
      throw new Error("SpotifyPlayer isn't enabled");
    }
  }

  setVolume(volume) {
    this.volume = volume;

    if (this.player) {
      this.player.setVolume(volume);
    }
  }

  getPlaybackState() {
    return fetch(`https://api.spotify.com/v1/me/player`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      },
      method: "GET"
    }).then(d => {
      if (d.status === 204) {
        return new Promise(resolve => {
          return resolve(undefined);
        });
      }
      return d.json();
    });
  }

  trackSeekPosition() {
    clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.progressMs += 500;
    }, 500);
  }

  stopTrackingSeekPosition() {
    clearInterval(this.timer);
  }

  addListeners() {
    this.player.addListener("initialization_error", e => {
      console.error("initialization_error", e.message);
    });
    this.player.addListener("authentication_error", e => {
      console.error("authentication_error", e.message);
    });
    this.player.addListener("account_error", e => {
      this.handleAccountError();
      console.error("account_error", e.message);
    });
    this.player.addListener("playback_error", e => {
      this.load(this.currentTrack, this.progressMs);
      console.error("playback_error", e);
    });

    // Playback status updates
    this.player.removeListener("player_state_changed");
    this.player.addListener("player_state_changed", state => {
      this.handleStateChange(state);
    });

    this.player.addListener("ready", data => {
      let d = new Date();
      console.log(
        `Ready with Device ID: ${
          data.device_id
        } @${d.getHours()}:${d.getMinutes()}`
      );

      this.deviceId = data.device_id;

      if (this.queuedTrack) {
        this.load(this.queuedTrack);
        this.queuedTrack = null;
      }

      if (this.onReady) {
        this.onReady();
      }
    });

    this.player.addListener("not_ready", data => {
      console.log("Device ID has gone offline", data.device_id);
      this.deviceId = null;

      this.stopTrackingSeekPosition();

      if (this.onNotReady) {
        this.onNotReady();
      }
    });
  }

  handleStateChange(state) {
    const prevStateExists = this.prevState && state;

    if (prevStateExists) {
      const currentTrackIsInPreviousTracks = state.track_window.previous_tracks.find(
        x => x.id === state.track_window.current_track.id
      );
      const notPausedBeforeButPausedNow =
        !this.prevState.paused && state.paused;

      const notPlayingBeforeButPlayingNow =
        this.prevState.paused && !state.paused;

      if (currentTrackIsInPreviousTracks && notPausedBeforeButPausedNow) {
        this.stopTrackingSeekPosition();

        if (this.onTrackEnd) {
          this.onTrackEnd();
        }
      } else if (notPausedBeforeButPausedNow) {
        if (this.controls) {
          this.controls.pause();
        }
      } else if (notPlayingBeforeButPlayingNow) {
        if (this.controls) {
          this.controls.play();
        }
      }
    }

    this.prevState = state;

    if (state) {
      this.progressMs = state.position;
    }
  }

  handleAccountError() {
    if (this.onAccountError) {
      this.onAccountError();
    }
  }
}

function appendSpotifySdkScriptToDOM() {
  const spotifyScript = document.createElement("script");
  spotifyScript.id = "spotify-script";
  spotifyScript.src = "https://sdk.scdn.co/spotify-player.js";
  document.head.appendChild(spotifyScript);
}

SpotifyPlayer.propTypes = {
  isPlaying: PropTypes.bool.isRequired
};

export default SpotifyPlayer;
