require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 8888;

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  MUSIXMATCH_API,
  REFRESH_TOKEN,
} = process.env;

// storage utilities for writing and reading token.json file
const {
  readTokenStorage,
  writeTokenStorage,
  isTimestampExpired,
} = require('./storage');

const { requestNewAccessToken } = require('./spotify');

const lyricBaseURL = 'https://api.musixmatch.com/ws/1.1';

const spotifyApiURL = 'https://api.spotify.com/v1';

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

const generateRandomString = (length) => {
  let text;
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

app.get('/', (req, res) => {
  const jsonData = {
    name: 'Craig',
    age: 40,
  };

  res.json(jsonData);
});

// LOGIN
app.get('/login', (req, res) => {
  const stateKey = 'spotify_auth_state';
  const state = generateRandomString(16);
  const scope = ['user-read-private', 'user-read-email', 'user-top-read'].join(
    ' '
  );

  const loginparams = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
    scope,
  }).toString();

  res.cookie(stateKey, state);

  res.redirect(`https://accounts.spotify.com/authorize?${loginparams}`);
});

// CALLBACK
app.get('/callback', (req, res) => {
  const code = req.query.code || null;

  const callbackparams = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const authToken = new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    'base64'
  );

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: callbackparams.toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${authToken}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, refresh_token, expires_in } = response.data;

        const refreshparams = new URLSearchParams({
          access_token,
          refresh_token,
          expires_in,
        }).toString();

        res.redirect(`http://localhost:3000/?${refreshparams}`);
      } else {
        const errorparams = new URLSearchParams({
          error: 'invalid_token',
        }).toString();

        res.redirect(`/?${errorparams}`);
      }
    })

    .catch((error) => res.send(error));
});

// REFRESH TOKEN
app.get('/refresh_token', async (req, res) => {
  const result = await requestNewAccessToken();
  res.json(result);
});

// HANDLE REQUEST FOR TRACK ID FROM MUSIXMATCH
app.get('/track_id', (req, res) => {
  const { track_isrc } = req.query;

  axios
    .get(
      `${lyricBaseURL}/track.get?apikey=${MUSIXMATCH_API}&track_isrc=${track_isrc}`
    )
    .then((response) => res.send(response.data))
    .catch((error) => res.send(error));
});

// HANDLE REQUEST FOR TRACK LYRICS FROM MUSIXMATCH
app.get('/track_lyrics', (req, res) => {
  const { track_id } = req.query;

  axios
    .get(
      `${lyricBaseURL}/track.lyrics.get?apikey=${MUSIXMATCH_API}&track_id=${track_id}`
    )
    .then((response) => res.send(response.data))
    .catch((error) => res.send(error));
});

app.post('/save-token', async (req, res) => {
  const { shouldRefresh, time_stamp } = await isTimestampExpired();

  res.json({ refresh_token: REFRESH_TOKEN, time_stamp, shouldRefresh });
});

app.get('/me', async (req, res) => {
  const { access_token } = await readTokenStorage();

  axios
    .get(`${spotifyApiURL}/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => res.send(response.data))
    .catch((err) => res.send(err));
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
