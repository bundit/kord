import { createStateSyncMiddleware } from "redux-state-sync";
import * as Sentry from "@sentry/react";
import watch from "redux-watch";

import {
  ADD_TRACK_TO_USER_QUEUE,
  APPEND_QUEUE,
  CLEAR_REST_OF_QUEUE,
  COLLAPSE_PLAYER,
  NEXT_TRACK,
  PAUSE,
  PLAY,
  PLAY_FROM_QUEUE,
  PREV_TRACK,
  REMOVE_TRACK_FROM_QUEUE,
  SEEK,
  SET_ARTIST_RESULTS,
  SET_AUTOCOMPLETE_RESULTS,
  SET_CONTEXT,
  SET_DURATION,
  SET_MORE_TRACK_RESULTS,
  SET_NEXT_QUEUE_HREF,
  SET_QUERY,
  SET_QUEUE,
  SET_QUEUE_INDEX,
  SET_RELATED_TRACKS,
  SET_SEEK,
  SET_SETTINGS_OPEN_STATUS,
  SET_TRACK,
  SET_TRACK_RESULTS,
  TOGGLE_ADD_TO_PLAYLIST_FORM,
  TOGGLE_DELETE_TRACK_FORM,
  TOGGLE_EXPANDED_PLAYER,
  TOGGLE_KEYBOARD_CONTROLS_MENU,
  TOGGLE_USER_QUEUE
} from "./actions/types";
import { fetchGeneric } from "../utils/fetchGeneric";
import {
  generatePlaylistsPayload,
  generateProfilePayload
} from "../utils/formattingHelpers";
import {
  hasNewPlaylistOrHasChanges,
  hasProfileChanges
} from "../utils/compareHelpers";
import { saveState } from "../utils/localStorage";

const { BroadcastChannel, createLeaderElection } = require("broadcast-channel");

export function synchronizeDataStore(store) {
  syncStateToLocalStorage(store);
  syncProfilesToServer(store);
  syncPlaylistsToServer(store);
}

export const channel = new BroadcastChannel(
  `${window.location.origin}::${process.env.NODE_ENV}`
);
const elector = createLeaderElection(channel);
let isLeader = false;
elector.awaitLeadership().then(() => {
  isLeader = true;
});

function syncStateToLocalStorage(store) {
  store.subscribe(() => {
    const state = store.getState();
    // Store the library in localStorage
    saveState({
      library: state.library,
      user: {
        ...state.user,
        history: {
          library: ["/app/library"],
          search: ["/app/search"],
          explore: ["/app/explore"]
        }
      },
      player: {
        ...state.player,
        isMuted: false,
        isPlaying: false,
        seek: 0,
        context: state.player.context
      },
      search: {
        history: state.search.history
      }
    });
  });
}

function syncProfilesToServer(store) {
  let watchProfiles = watch(store.getState, "user");

  store.subscribe(
    watchProfiles((newUserObj, prevUserObj, objectPath) => {
      const sources = ["spotify", "soundcloud", "youtube", "mixcloud"];

      for (let source of sources) {
        const newProfile = newUserObj[source];
        const prevProfile = prevUserObj[source];

        if (hasProfileChanges(newProfile, prevProfile) && isLeader) {
          const payload = generateProfilePayload(source, newProfile);

          fetchGeneric("/user/profiles", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }).catch(e =>
            Sentry.captureMessage(
              `Error syncing playlists with database. Source: ${source} Payload: ${payload.profile}`
            )
          );
        }
      }
    })
  );
}

function syncPlaylistsToServer(store) {
  let watchPlaylists = watch(store.getState, "library.playlists");

  store.subscribe(
    watchPlaylists((newPlaylistObj, prevPlaylistObj, objectPath) => {
      for (let source in newPlaylistObj) {
        const newPlaylists = newPlaylistObj[source];
        const prevPlaylists = prevPlaylistObj[source];

        if (
          hasNewPlaylistOrHasChanges(newPlaylists, prevPlaylists) &&
          isLeader
        ) {
          const payload = generatePlaylistsPayload(source, newPlaylists);

          fetchGeneric("/user/playlists", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }).catch(e =>
            Sentry.captureMessage(
              `Error syncing playlists with database. Source: ${source} Payload: ${payload.playlists}`
            )
          );
        }
      }
    })
  );
}

export function tabSyncMiddleware() {
  const config = {
    blacklist: [
      PLAY,
      PAUSE,
      SEEK,
      SET_TRACK,
      SET_DURATION,
      SET_SEEK,
      NEXT_TRACK,
      PREV_TRACK,
      SET_QUEUE,
      SET_QUEUE_INDEX,
      ADD_TRACK_TO_USER_QUEUE,
      REMOVE_TRACK_FROM_QUEUE,
      SET_NEXT_QUEUE_HREF,
      SET_CONTEXT,
      APPEND_QUEUE,
      PLAY_FROM_QUEUE,
      SET_RELATED_TRACKS,
      CLEAR_REST_OF_QUEUE,
      SET_SETTINGS_OPEN_STATUS,
      TOGGLE_ADD_TO_PLAYLIST_FORM,
      TOGGLE_DELETE_TRACK_FORM,
      TOGGLE_USER_QUEUE,
      TOGGLE_KEYBOARD_CONTROLS_MENU,
      TOGGLE_EXPANDED_PLAYER,
      COLLAPSE_PLAYER,
      SET_QUERY,
      SET_SEEK,
      SET_TRACK_RESULTS,
      SET_MORE_TRACK_RESULTS,
      SET_ARTIST_RESULTS,
      SET_AUTOCOMPLETE_RESULTS
    ]
  };

  return createStateSyncMiddleware(config);
}
