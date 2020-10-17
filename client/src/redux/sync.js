import * as Sentry from "@sentry/react";
import watch from "redux-watch";

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

export function synchronizeDataStore(store) {
  syncStateToLocalStorage(store);
  syncProfilesToServer(store);
  syncPlaylistsToServer(store);
}

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

        if (hasProfileChanges(newProfile, prevProfile)) {
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

        if (hasNewPlaylistOrHasChanges(newPlaylists, prevPlaylists)) {
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
