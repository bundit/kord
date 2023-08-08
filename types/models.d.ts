import { OauthProvider, Source } from "./common/kord";

interface BaseDao {
  /*
    TODO:
    created_at: string
    last_updated: string;
  */
}

export interface UserDao extends BaseDao {
  id: string;
  username?: string;
  email: string;
  created_at?: string; // TODO: not null
}

export interface UserProfileDao extends BaseDao {
  user_id: string;
  oauth_provider: OauthProvider;
  provider_id: string;
  refresh_token?: string;
  images?: string[];
  username?: string;
  profile_url?: string;
}

export interface UserPlaylistDao extends BaseDao {
  user_id: string;
  source: string;
  external_id: string;
  title: string;
  is_connected: boolean;
  index: number;
  img?: string;
  total: number;
  is_starred: boolean;
}

// TODO: Need to add created_at field to KeyDao for
export interface KeyDao extends BaseDao {
  source: Source;
  type: "client_id";
  key: string;
  last_updated: string;
}
