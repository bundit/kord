import * as Sentry from "@sentry/react";
import watch from "redux-watch";

import { fetchGeneric } from "../utils/fetchGeneric";
import { generatePlaylistsPayload } from "../utils/formattingHelpers";
import { hasNewPlaylistOrHasChanges } from "../utils/compareHelpers";
import { saveState } from "../utils/localStorage";

export function synchronizeDataStore(store) {
  syncStateToLocalStorage(store);
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
          search: [],
          more: []
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
