export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";
export const SPOTIFY_CALLBACK = process.env.SPOTIFY_CALLBACK || "";
export const SPOTIFY_LINK_CALLBACK = process.env.SPOTIFY_LINK_CALLBACK || "";

export const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || "";
export const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || "";
export const YOUTUBE_CALLBACK = process.env.YOUTUBE_CALLBACK || "";
export const YOUTUBE_LINK_CALLBACK = process.env.YOUTUBE_LINK_CALLBACK || "";

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_TOKEN_EXPIRE = process.env.JWT_TOKEN_EXPIRE || "";

export const BUILD_ENV = process.env.BUILD_ENV || "";
export const NODE_ENV = process.env.NODE_ENV || "";

export const PORT = process.env.PORT || 8888;

export const DATABASE_URL = process.env.DATABASE_URL || "";

if (
  [
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_CALLBACK,
    SPOTIFY_LINK_CALLBACK,
  ].some((envVar) => !envVar)
) {
  throw new Error("Missing Spotify OAuth ENV Var(s)");
}

if (
  [
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_CALLBACK,
    YOUTUBE_LINK_CALLBACK,
  ].some((envVar) => !envVar)
) {
  throw new Error("Missing Google OAuth ENV Var(s)");
}

if (!JWT_TOKEN_EXPIRE || !JWT_SECRET) {
  throw new Error("Missing JWT ENV Var(s)");
}

if (!BUILD_ENV || !NODE_ENV) {
  throw new Error("Missing Build/Node ENV Var(s)");
}

if (!DATABASE_URL) {
  throw new Error("Missing database ENV Var(s)");
}
