import { Request } from "express";
import jwtDecode from "jwt-decode";
import { PoolClient } from "pg";
import passportSpotify = require("passport-spotify");
import passportGoogle = require("passport-google-oauth20");
import { KordJWT } from "../types";
import { OauthProvider } from "../types/common/kord";
import { UserDao, UserProfileDao } from "../types/models";
import db = require("../config/database-setup");

type VerifyCallback =
  | passportSpotify.VerifyCallback
  | passportGoogle.VerifyCallback;
type OAuthProfile = passportSpotify.Profile | passportGoogle.Profile;

// Returns false if does not exist, otherwise returns user row
async function findUserByEmail(
  client: PoolClient,
  email: string,
): Promise<UserDao | undefined> {
  const searchQuery = {
    text: `SELECT *
             FROM users
             WHERE email=$1`,
    values: [email],
  };

  const { rows: userSearchRows } = await client.query<UserDao>(searchQuery);
  const user = userSearchRows[0];

  return user;
}

// Insert a user and return the new row
async function insertNewUser(
  client: PoolClient,
  email: string,
): Promise<UserDao | undefined> {
  const userInsertQuery = {
    text: `INSERT INTO users(id, email, created_at)
           VALUES
           (
              uuid_generate_v4(),
              $1,
              now()
           )
           RETURNING *;`,
    values: [email],
  };
  const {
    rows: [newUser],
  } = await client.query<UserDao>(userInsertQuery);

  return newUser;
}

// Insert a new external user login profile
async function insertUserProfile(
  client: PoolClient,
  userProfile: UserProfileDao,
): Promise<void> {
  // eslint-disable-next-line camelcase
  const { user_id, oauth_provider, provider_id, refresh_token } = userProfile;

  const profileInsertQuery = {
    text: `INSERT INTO user_profiles(user_id, oauth_provider, provider_id, refresh_token)
             VALUES (
               $1, $2, $3, $4
             )
           ON CONFLICT (user_id, oauth_provider) DO UPDATE
             SET refresh_token=$4`,
    // eslint-disable-next-line camelcase
    values: [user_id, oauth_provider, provider_id, refresh_token],
  };

  await client.query(profileInsertQuery);
}

function SignUpOrSignIn(
  profile: OAuthProfile,
  refreshToken: string,
  accessToken: string,
  done: VerifyCallback,
): void {
  db.getClient(async (client) => {
    const {
      id: providerID,
      _json: { email, images },
      provider,
    } = profile;

    const kordUser =
      (await findUserByEmail(client, email)) ||
      (await insertNewUser(client, email));

    if (!kordUser) {
      throw new Error("SignUpOrSignIn Error - Failed to create user");
    }

    const newUserProfile: UserProfileDao = {
      user_id: kordUser.id,
      refresh_token: refreshToken,
      provider_id: providerID,
      oauth_provider: provider as OauthProvider,
      images,
    };

    await insertUserProfile(client, newUserProfile);

    done(null, { ...kordUser, accessToken });
  });
}

function LinkAccount(
  req: Request,
  profile: OAuthProfile,
  refreshToken: string,
  accessToken: string,
  done: VerifyCallback,
): void {
  db.getClient(async (client) => {
    const {
      id: providerID,
      _json: { images },
      provider,
    } = profile;

    const kordUser: KordJWT = jwtDecode(req.cookies.kordUser);

    const newUserProfile: UserProfileDao = {
      user_id: kordUser.id,
      refresh_token: refreshToken,
      provider_id: providerID,
      oauth_provider: provider as OauthProvider,
      images,
    };

    await insertUserProfile(client, newUserProfile);

    done(null, { ...kordUser, accessToken });
  });
}

export = {
  SignUpOrSignIn,
  LinkAccount,
};
