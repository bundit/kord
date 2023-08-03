import { Playlist, Source, Track } from "../types/global";

export interface PlayerState {
  currentTrack: Track;
  isMuted: boolean;
  duration: number;
  seek: number;
  isPlaying: boolean;
  volume: number; // between 0 and 1
  index: number;
  queue: Track[];
  userQueueIndex: number;
  userQueue: Track[];
  relatedTracksIndex: number;
  relatedTracks: Track[];
  context: {
    source: Source;
    id?: string | number;
  };
  nextHref?: string;
  seekAmount: 15 | number;
  isPlayerExpanded: boolean;
  allowAutoPlay: boolean;
  shuffleEnabled: boolean;
  repeatEnabled: boolean;
  showYoutubePlayer: boolean;
}

export interface LibraryState {
  playlists: Record<Source, Playlist>;
}

interface BaseSearchState {
  query: string;
  autoCompleteResults: string[];
  history: string[];
}

interface SourceSearchResults {
  tracks: {
    list: Track[];
    next: string | null;
  };
  artists?: Artist[];
}

export type SearchState = BaseSearchState & Record<Source, SourceSearchResults>;

interface SourceProfile {
  isConnected: boolean;
  username?: string;
  image?: string;
  profileUrl?: string;
  token?: string;
}

export interface UserState {
  kord: {
    id: string;
    mainConnection: Source;
  };
  soundcloud: SourceProfile;
  spotify: SourceProfile;
  youtube: SourceProfile;
  mixcloud: SourceProfile;
  history: {
    library: string[];
    search: string[];
    explore: string[];
  };
  settings: {
    isSettingsOpen: boolean;
    settingsSource: Source;
    isAddToPlaylistFormOpen: boolean;
    isDeleteTrackFormOpen: boolean;
    currentTrackDropdown?: Track;
    isUserQueueOpen: boolean;
    isKeyboardControlsOpen: boolean;
    showUnsupportedBrowserModal: boolean;
  };
}

export interface RootState {
  library: LibraryState;
  search: SearchState;
  player: PlayerState;
  user: UserState;
}
