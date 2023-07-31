interface SoundcloudTrackLite {
  id: number;
  kind: string | "track";
  monetization_model: "NOT_APPLICABLE" | string;
  policy: "ALLOW" | string;
}

export interface SoundcloudTrack extends SoundcloudTrackLite {
  artwork_url: string;
  comment_count: number;
  created_at: string; // UTC time
  description: string;
  duration: number; // milliseconds
  full_duration: number; // milliseconds
  genre: string;
  likes_count: number;
  permalink: string; // mood-provider-8-full-mixtape
  permalink_url: string; // https://soundcloud.com/flamingosis/mood-provider-8-full-mixtape
  playback_count: number;
  reposts_count: number;
  tag_list: string;
  title: string;
  track_format: string | "single-track";
  uri: string; // https://api.soundcloud.com/tracks/1342486297
  urn: string; // soundcloud:tracks:1342486297
  user_id: number;
  waveform_url: string; // https://wave.sndcdn.com/RUDDjsM7OtcD_m.json
  media: {
    transcodings: SoundcloudTranscoding;
  };
  station_urn: string; // "soundcloud:system-playlists:track-stations:1342486297",
  station_permalink: string; // "track-stations:1342486297"
  user: SoundcloudUser;
}

interface SoundcloudTranscoding {
  url: string; // "https://api-v2.soundcloud.com/media/soundcloud:tracks:1342486297/a6965c5f-4095-4e02-83d9-bc73f609b283/stream/hls"
  preset: "mp3_1_0" | "opus_0_0";
  duration: number; // 3062047
  snipped: boolean;
  format: {
    protocol: "hls" | "progressive";
    mime_type: "audio/mpeg" | 'audio/ogg; codecs="opus"';
  };
  quality: "sq" | string;
}

interface SoundcloudUserLite {
  avatar_url: string; // "https://i1.sndcdn.com/avatars-bGTuzVo6T2pGfJO8-6rpWIQ-large.jpg",
  first_name: string;
  followers_count: number;
  full_name: string;
  id: number;
  kind: string | "user";
  last_name: string;
  permalink: string; // "flamingosis",
  permalink_url: string; // "https://soundcloud.com/flamingosis",
  uri: string; // "https://api.soundcloud.com/users/1410762",
  urn: string; // "soundcloud:users:1410762",
  username: string; // "Flamingosis",
  city: string; // "New Jersey // Brooklyn",
  country_code: string | "US";
  badges: {
    pro: boolean;
    pro_unlimited: boolean;
    verified: boolean;
  };
  station_urn: string; // "soundcloud:system-playlists:artist-stations:1410762",
  station_permalink: string; // "artist-stations:1410762"
}

export interface SoundcloudUser extends SoundcloudUserLite {
  comments_count: number;
  created_at: string; // UTC
  description: string; // "Management : asmith@c3mgmt.com myoung@c3mgmt.com \nBooking: dlandau@paradigmagency.com\n____________________\n\nFlamingosis (the name comes from a free- style Frisbee move that his father invented) is a New Jersey-based electronic music producer and beatboxer. Drawing on influences from other producers such as Flying Lotus and J Dilla as well as vintage funk and disco music, Flamingosis creates engaging and souful tracks and puts on an infectiously energetic live show."
  followings_count: number;
  likes_count: number;
  playlist_likes_count: number;
  playlist_count: number;
  reposts_count: null | number;
  track_count: number;
  visuals: Array<{
    urn: string;
    entry_time: number;
    visual_url: string; // "https://i1.sndcdn.com/visuals-000001410762-jyZL3A-original.jpg"
  }>;
}

interface SoundcloudPlaylist {
  artwork_url: null | string;
  created_at: string; // UTC
  description: null | string;
  duration: number;
  embeddable_by: "all" | string;
  genre: string;
  id: number;
  kind: "playlist" | string;
  label_name: null | string;
  likes_count: number;
  permalink: string;
  permalink_url: string;
  public: boolean;
  purchase_title: null | string;
  purchase_url: null | string;
  release_date: null | string;
  reposts_count: number;
  tag_list: string;
  title: string;
  uri: string;
  set_type: string;
  user_id: number;
  is_album: boolean;
  published_at: string; // UTC
  user: SoundcloudUserLite;
  tracks: (SoundcloudTrackLite | SoundcloudTrack)[];
  tracks_count: number;
}

interface SoundcloudCollectionResponse<T> {
  collection: T[];
  next_href: string;
}

interface SoundcloudSearchResponse<T> extends SoundcloudCollectionResponse<T> {
  total_results: number;
  query_urn: string;
}

export type SoundcloudArtistSearchResponse =
  SoundcloudSearchResponse<SoundcloudUser>;

export type SoundcloudTrackSearchResponse =
  SoundcloudSearchResponse<SoundcloudTrack>;

export type SoundcloudGetUserPlaylistsResponse =
  SoundcloudCollectionResponse<SoundcloudPlaylist>;
