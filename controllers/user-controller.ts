import { Request, Response } from "express";
import jwtDecode from "jwt-decode";
import { KordJWT } from "../types";
import { Source } from "../types/common/kord";
import db = require("../config/database-setup");

async function getUserProfiles(req: Request, res: Response): Promise<Response> {
  const kordUser: KordJWT = jwtDecode(req.cookies.kordUser);
  const exclude = req.query.exclude || "none";

  const query = {
    text: `SELECT oauth_provider as source, provider_id as id, images as image, profile_url as "profileUrl", username
           FROM user_profiles
           WHERE user_id=$1 AND oauth_provider!=$2`,
    values: [kordUser.id, exclude],
  };

  try {
    const result = await db.query(query);
    return res.json(result.rows);
  } catch (e) {
    return res.status(400).json(e);
  }
}

interface UserProfileDto {
  id: string;
  img: string[];
  username?: string;
  profile_url: string;
}

interface PutUserProfileDto {
  source: Source;
  profile: UserProfileDto;
}

async function insertUserProfile(
  req: Request<{}, {}, PutUserProfileDto>,
  res: Response,
): Promise<Response> {
  const kordUser: KordJWT = jwtDecode(req.cookies.kordUser);
  const { source, profile } = req.body;

  const query = {
    text: `INSERT INTO user_profiles(user_id, oauth_provider, provider_id, images, username, profile_url)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (user_id, oauth_provider) DO UPDATE
             SET provider_id=$3, images=$4, username=$5;`,
    values: [
      kordUser.id,
      source,
      profile.id,
      profile.img,
      profile.username,
      profile.profile_url,
    ],
  };

  try {
    await db.query(query);
  } catch (e) {
    return res.status(400).json(e);
  }

  return res.status(204).send();
}

async function deleteUserProfile(
  req: Request,
  res: Response,
): Promise<Response> {
  const kordUser: KordJWT = jwtDecode(req.cookies.kordUser);
  const { provider } = req.query;

  if (!provider) {
    return res.status(400).send("Missing parameter provider");
  }

  try {
    await db.transaction(async (client) => {
      const deleteProfileQuery = {
        text: `DELETE FROM user_profiles
               WHERE user_id=$1 AND oauth_provider=$2`,
        values: [kordUser.id, provider],
      };

      await client.query(deleteProfileQuery);

      const deletePlaylistsQuery = {
        text: `DELETE FROM user_playlists
               WHERE user_id=$1 AND source=$2`,
        values: [kordUser.id, provider],
      };

      await client.query(deletePlaylistsQuery);
    });
  } catch (e) {
    return res.status(400).json(e);
  }

  return res.status(204).send();
}

async function getUserPlaylists(
  req: Request,
  res: Response,
): Promise<Response> {
  const kordUser: KordJWT = jwtDecode(req.cookies.kordUser);
  const exclude = req.query.exclude || "none";

  const query = {
    text: `SELECT source, external_id, title, is_connected as "isConnected", index, img, total, is_starred as "isStarred"
           FROM
             (users JOIN user_playlists
             ON users.id=user_playlists.user_id)
           WHERE users.id=$1 AND user_playlists.source!=$2
           ORDER BY source, index;`,
    values: [kordUser.id, exclude],
  };

  try {
    const result = await db.query(query);
    return res.json(result.rows);
  } catch (e) {
    return res.status(400).json(e);
  }
}

interface PlaylistDto {
  id: string;
  isConnected: boolean;
  title: string;
  index: number;
  img: string[];
  total: number;
  isStarred: boolean;
}

interface PutUserPlaylistsDto {
  source: Source;
  playlists: PlaylistDto[];
}

async function insertUserPlaylists(
  req: Request<{}, {}, PutUserPlaylistsDto>,
  res: Response,
): Promise<Response> {
  const kordUser: KordJWT = jwtDecode(req.cookies.kordUser);
  const { source } = req.body;
  const { playlists } = req.body;

  try {
    await db.transaction(async (client) => {
      if (source) {
        const deleteQuery = {
          text: `DELETE FROM user_playlists
                  WHERE user_id=$1 AND source=$2;`,
          values: [kordUser.id, source],
        };

        await client.query(deleteQuery);
      }

      await Promise.all(
        playlists.map((playlist) => {
          const { id, title, isConnected, index, img, total, isStarred } =
            playlist;
          const insertQuery = {
            text: `INSERT INTO user_playlists(user_id, source, external_id, title, is_connected, index, img, total, is_starred)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
            values: [
              kordUser.id,
              source,
              id,
              title,
              isConnected,
              index,
              JSON.stringify(img),
              total,
              isStarred,
            ],
          };

          return client.query(insertQuery);
        }),
      );
    });
  } catch (e) {
    return res.status(400).json(e);
  }

  return res.status(204).send();
}

export = {
  getUserProfiles,
  insertUserProfile,
  deleteUserProfile,
  getUserPlaylists,
  insertUserPlaylists,
};
