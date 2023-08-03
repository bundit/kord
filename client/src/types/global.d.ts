declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

type Source = "soundcloud" | "spotify" | "youtube";

export interface Track {
  title: string;
  id: string | number;
  duration: number;
  img: string;
  artist: {
    name: string;
    img: string;
    id: string | number;
  };
  permalink?: string;
  type?: string;
  source: Source;
  streamable: boolean;
  // YouTube
  playlistItemId?: string;
}

export interface Playlist {
  // From external
  id: string | number;
  title: string;
  img: string | string[];
  source: Source;
  tracks: Track[];
  total: number;
  next: "start" | string;
  // Soundcloud
  description?: string;
  externalUrl?: string;
  // Kord playlist properties
  isConnected: boolean;
  isStarred: boolean;
  dateSynced: string;
}
