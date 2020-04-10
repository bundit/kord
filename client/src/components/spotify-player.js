import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

const SpotifyPlayer = ({
  playerRef,
  accessToken,
  track,
  isPlaying,
  onEnd,
  volume
}) => {
  React.useEffect(() => {
    if (!window.Spotify) {
      addSpotifySdkToDom();
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (!playerRef.current) {
        playerRef.current = new SpotifyP();
        playerRef.current.init(accessToken);
        playerRef.current.onEnd = onEnd;
      }
    };
  }, [accessToken, playerRef, onEnd]);

  React.useEffect(() => {
    if (track.source !== "spotify") {
      return;
    }

    if (playerRef.current && track.source === "spotify") {
      playerRef.current.load(track.id);
    }
  }, [playerRef, track]);

  React.useEffect(() => {
    if (track.source !== "spotify") {
      return;
    }

    if (isPlaying) {
      playerRef.current.play();
    } else if (!isPlaying) {
      playerRef.current.pause();
    }
  }, [isPlaying]);

  return <></>;
};

class SpotifyP {
  constructor(playerName) {
    this.deviceId = "";
    this.accessToken = "";
    this.isReady = false;
    this.isDone = false;
    this.hasSong = false;
    this.timer = null;
    this.playerName = playerName;
  }

  init(accessToken) {
    this.accessToken = accessToken;
    this.player = new window.Spotify.Player({
      name: this.playerName,
      getOAuthToken: cb => {
        cb(accessToken);
      }
    });

    this.addListeners();

    // Connect to the player!
    try {
      this.player.connect();
    } catch (e) {
      console.err(`Error connecting spotify player: ${e}`);
    }

    this.isReady = true;
  }

  load(trackId, tries = 3) {
    if (!tries) {
      console.err(`Couldn't load track ${trackId}`);
      return;
    }
    if (this.isReady && this.deviceId) {
      // this.hasSong = true;
      this.progressMs = 0;
      return fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            uris: [`spotify:track:${trackId}`]
          })
        }
      ).catch(e => {
        console.err(`Error loading track ${trackId}: ${e}`);
      });
    } else {
      setTimeout(() => this.load(trackId, --tries), 300);
    }
  }

  play(tries = 3) {
    if (!tries) {
      console.err(`Error playing spotify track`);
    }

    if (this.isReady && this.player) {
      this.player.resume();
      this.timer = setInterval(() => (this.progressMs += 500), 500);
    } else {
      setTimeout(() => this.play(--tries), 300);
    }
  }

  pause() {
    if (this.isReady && this.player) {
      this.player.pause();
      clearTimeout(this.timer);
    } else {
      throw new Error("SpotifyPlayer isn't enabled");
    }
  }

  seek(position) {
    if (!position && position !== 0) {
      return this.progressMs;
    }

    if (this.isReady && this.player) {
      this.player.seek(position);
    } else {
      throw new Error("SpotifyPlayer isn't enabled");
    }
  }

  stop() {
    if (this.isReady && this.player) {
      this.hasSong && this.player.pause();
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
      state.track_window.previous_tracks.find(
        x => x.id === state.track_window.current_track.id
      ) &&
      !this.state.paused &&
      state.paused
    ) {
      // Track ended
      clearTimeout(this.timer);
      this.stop();

      if (this.onEnd) {
        this.onEnd();
      }
    }

    this.state = state;
    this.progressMs = state.position;
  }

  addListeners() {
    // Error handling
    this.player.addListener("initialization_error", e => {
      console.error(e.message);
    });
    this.player.addListener("authentication_error", e => {
      console.error(e.message);
    });
    this.player.addListener("account_error", e => {
      console.error(e.message);
    });
    this.player.addListener("playback_error", e => {
      console.error(e.message);
    });

    // Playback status updates
    this.player.removeListener("player_state_changed");
    this.player.addListener("player_state_changed", state =>
      this.handleStateChange(state)
    );

    // Ready
    this.player.addListener("ready", data => {
      console.log("Ready with Device ID: ", data.device_id);
      this.deviceId = data.device_id;
    });

    // Not Ready
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
