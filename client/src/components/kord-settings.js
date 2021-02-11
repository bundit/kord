import { useDispatch, useSelector } from "react-redux";
import React from "react";

import {
  setAutoPlay,
  setShowYoutubePlayer
} from "../redux/actions/playerActions";
import { setMainConnection } from "../redux/actions/userActions";
import SelectMenu from "./select-menu";
import ToggleSwitch from "./toggle-switch";
import styles from "../styles/kord-settings.module.scss";

function KordSettings() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const allowAutoPlay = useSelector(state => state.player.allowAutoPlay);
  const mainConnection = useSelector(state => state.user.kord.mainConnection);
  const youtubeIsConnected = useSelector(
    state => state.user.youtube.isConnected
  );
  const showYoutubePlayer = useSelector(
    state => state.player.showYoutubePlayer
  );
  const connectedSources = Object.keys(user).filter(
    source => user[source].isConnected
  );

  function defaultSearchOnChange(e) {
    dispatch(setMainConnection(e.target.value));
  }

  function toggleAutoPlay(e) {
    dispatch(setAutoPlay(e.target.checked));
  }

  function toggleHideYoutubePlayer(e) {
    dispatch(setShowYoutubePlayer(e.target.checked));
  }

  return (
    <ul className={styles.settingsList}>
      <li>
        <h2>Main Connection:</h2>
        <SelectMenu
          name="Main Connection"
          selectedOption={mainConnection}
          values={connectedSources}
          onChange={defaultSearchOnChange}
        />
      </li>
      <li>
        <h2>Autoplay: </h2>
        <ToggleSwitch
          id="autoplay"
          value={allowAutoPlay}
          onChange={toggleAutoPlay}
        />
      </li>
      <li>
        <h2 style={{ opacity: youtubeIsConnected ? 1 : 0.5 }}>
          Show YouTube Player:
        </h2>
        <ToggleSwitch
          id="show-youtube-player"
          value={showYoutubePlayer}
          onChange={toggleHideYoutubePlayer}
          disabled={!youtubeIsConnected}
        />
      </li>
    </ul>
  );
}

export default KordSettings;
