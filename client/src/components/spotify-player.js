import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { refreshSpotifyToken } from "../redux/actions/spotifyActions";

const SpotifyPlayer = ({
  playerRef,
  playerName,
  accessToken,
  track,
  isPlaying,
  onEnd,
  volume
}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!window.Spotify) {
      addSpotifySdkToDom();
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      function fetchToken() {
        return dispatch(refreshSpotifyToken());
      }

      if (!playerRef.current) {
        playerRef.current = new SpotifyWebPlaybackSdk(
          playerName,
          accessToken,
          fetchToken,
          onEnd
        );
        playerRef.current.initPlayer();
      }
    };
  }, []);

  React.useEffect(() => {
    if (!playerRef.current) return;

    if (track.source === "spotify") {
      if (isPlaying) {
        playerRef.current.load(track.id, isPlaying);
      } else {
        playerRef.current.isLoaded = false;
      }
    } else playerRef.current.pause();
  }, [track]);

  React.useEffect(() => {
    if (!playerRef.current || track.source !== "spotify") return;

    if (!isPlaying) {
      playerRef.current.pause();
    } else {
      if (!playerRef.current.isLoaded) {
        playerRef.current.load(track.id, isPlaying);
      } else playerRef.current.play();
    }
  }, [isPlaying]);

  return <></>;
};

class SpotifyWebPlaybackSdk {
  constructor(playerName, accessToken, fetchToken, onTrackEnd) {
    this.playerName = playerName;
    this.accessToken = accessToken;
    this.fetchToken = fetchToken;
    this.onTrackEnd = onTrackEnd;

    this.deviceId = "";
    this.isReady = false;
    this.timer = null;

    this.fetchAndSetToken = this.fetchAndSetToken.bind(this);
  }

  initPlayer() {
    this.player = new window.Spotify.Player({
      name: this.playerName,
      getOAuthToken: this.fetchAndSetToken,
      volume: 1
    });

    this.addListeners();

    try {
      this.player.connect();
    } catch (e) {
      console.error(`Error connecting spotify player: ${e}`);
    }

    this.isReady = true;
  }

  fetchAndSetToken(cb) {
    return this.fetchToken().then(token => {
      this.setAccessToken(token);
      if (cb) cb(token);
    });
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  load(trackId, tries = 3) {
    this.isLoaded = false;

    if (!tries) {
      return console.error(`Couldn't load track ${trackId}`);
    }

    if (this.isReady) {
      this.loadTrackToPlayer(trackId).then(res => {
        if (res.status === 401) {
          return this.fetchAndSetToken().then(() =>
            this.load(trackId, --tries)
          );
        }

        this.isLoaded = true;
        this.progressMs = 0;
        this.trackSeekPosition();
      });
    } else {
      setTimeout(() => this.load(trackId, --tries), 500);
    }
  }

  loadTrackToPlayer(trackId) {
    return fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`]
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

    if (this.isReady) {
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

    if (this.isReady) {
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

    if (this.isReady) {
      this.player.seek(position);
    } else {
      throw new Error("SpotifyPlayer isn't enabled");
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

  handleStateChange(state) {
    if (
      this.state &&
      state &&
      state.track_window.previous_tracks.find(
        x => x.id === state.track_window.current_track.id
      ) &&
      !this.state.paused &&
      state.paused
    ) {
      // Track ended
      this.stopTrackingSeekPosition();

      if (this.onTrackEnd) {
        this.onTrackEnd();
      }
    }

    this.state = state;
    this.progressMs = state.position;
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
      console.error("account_error", e.message);
    });
    this.player.addListener("playback_error", e => {
      console.error("playback_error", e);
    });

    // Playback status updates
    this.player.removeListener("player_state_changed");
    this.player.addListener("player_state_changed", state =>
      this.handleStateChange(state)
    );

    this.player.addListener("ready", data => {
      let d = new Date();
      console.log(
        `Ready with Device ID: ${
          data.device_id
        } @${d.getHours()}:${d.getMinutes()}`
      );
      this.deviceId = data.device_id;
    });

    this.player.addListener("not_ready", data => {
      console.log("Device ID has gone offline", data.device_id);
      this.deviceId = "";
    });
  }
}

function addSpotifySdkToDom() {
  const spotifyScript = document.createElement("script");
  spotifyScript.id = "spotify-script";
  spotifyScript.src = "https://sdk.scdn.co/spotify-player.js";
  document.head.appendChild(spotifyScript);
}

SpotifyPlayer.propTypes = {
  isPlaying: PropTypes.bool.isRequired
};

export default SpotifyPlayer;
