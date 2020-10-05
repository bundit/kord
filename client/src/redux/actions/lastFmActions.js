import { fetchGeneric } from "../../utils/fetchGeneric";

const LAST_FM_API = "https://ws.audioscrobbler.com/2.0/";

export function fetchArtistInfo(artistName) {
  const endpoint = `${LAST_FM_API}?method=artist.getinfo&artist=${artistName}&api_key=${process.env.REACT_APP_LAST_FM_KEY}&format=json`;

  return fetchGeneric(endpoint).then(json => mapJsonToArtistInfo(json));
}

function mapJsonToArtistInfo(json) {
  if (!json.artist) {
    return {};
  }

  const {
    artist: { similar, tags, bio }
  } = json;
  return {
    similar: similar.artist.map(artist => artist.name),
    tags: tags.tag.map(tag => tag.name),
    bio: bio.summary.replace(/<a[^>]*>([^<]+)<\/a>/g, "").trim(),
    fullBio: bio.content.replace(/<a[^>]*>([^<]+)<\/a>[ . ]/g, "").trim()
  };
}
