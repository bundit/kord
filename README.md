![kord-logo-small](https://user-images.githubusercontent.com/22352870/103503036-f198e980-4e07-11eb-94a7-e062e8979d36.png)

# Kord App

[Kord](https://www.kord.app): One place for all of your (Spotify | Soundcloud | Youtube) music. <br/>



Chromium and Firefox browsers supported only.

## Built With

- [React.js](https://reactjs.org/)
- [Gatsby.js](https://www.gatsbyjs.com/)
- [Redux](https://redux.js.org/)
- [SCSS](https://sass-lang.com/)
- [Express.js](https://expressjs.com/)
- [Postgresql](https://www.postgresql.org/)
- [Passport.js](http://www.passportjs.org/)

## Getting Started

### Prerequisites

- [Node](https://nodejs.org/en/) (v11.12.x)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install)
- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

## Installation and Setup

Express is served on port 8888 (localhost:8888/) <br/>
Landing page (Gatsby) is served on port 8000 (localhost:8000/) <br/>
Application (Create React App) is served on port 3000 (localhost:3000/app) <br/>

### Running The Development Server

Changing your node version (if necessary)

```
$ nvm use 11.12.0
```

Using Yarn:

```
# install dependencies
$ yarn

# start servers
$ yarn dev
```

Using npm:

```
# install dependencies
$ npm install

# start servers
$ npm dev
```

### Environment Variables

Server:
Development server variables are stored in a ".env" file at root

```
NODE_ENV=development
SPOTIFY_CLIENT_ID=XXXXX
SPOTIFY_CLIENT_SECRET=XXXXX
YOUTUBE_CLIENT_ID=XXXXX
YOUTUBE_CLIENT_SECRET=XXXXX
DATABASE_URL=XXXXX
JWT_SECRET=XXXXX
JWT_TOKEN_EXPIRE=XXXXX
SPOTIFY_CALLBACK=XXXXX
SPOTIFY_LINK_CALLBACK=XXXXX
YOUTUBE_CALLBACK=XXXXX
YOUTUBE_LINK_CALLBACK=XXXXX
```

Application:
Development app variables are stored in a ".env.development" file in the "client" folder

```
REACT_APP_SC_KEY=XXXX
REACT_APP_YT_KEY=XXXX
REACT_APP_SENTRY_DNS=XXXX
REACT_APP_LAST_FM_KEY=XXXX
```
