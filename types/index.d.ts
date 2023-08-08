// This User overwrites the Express.User definition that is injected by Passport (available on req.user)
export interface KordUser {
  email: string;
  id: string;
  accessToken?: string;
}

export interface KordJWT {
  id: string;
  email: string;
  expires: number;
}
