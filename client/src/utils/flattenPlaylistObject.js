// Take the global playlist object like
// {soundcloud: [], spotify: [], ...}
// and return a flat array of the playlist objects
export function flattenPlaylistObject(playlists) {
  let flatPlaylistObject = [];

  const playlistSources = Object.keys(playlists);

  for (let key of playlistSources) {
    flatPlaylistObject.push(...playlists[key]);
  }

  return flatPlaylistObject;
}
