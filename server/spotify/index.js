require('dotenv').config();
const axios = require('axios');
const { handleError } = require('../util');

const { getStoredAccessToken, writeTokenStorage } = require('../storage');

const URLS = {
  MAIN: 'https://api.spotify.com/v1',
  TOKEN: 'https://accounts.spotify.com/api/token',
};

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

const requestNewAccessToken = async () => {
  const refreshparams = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN,
  }).toString();

  try {
    const {
      data: { access_token, expires_in },
    } = await axios({
      method: 'post',
      url: URLS.TOKEN,
      data: refreshparams,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    });

    await writeTokenStorage({ access_token, expires_in });
    return access_token;
  } catch (e) {
    return handleError(requestNewAccessToken.name, e);
  }
};

const getOrRequestAccessToken = async () => {
  try {
    const token = await getStoredAccessToken();
    return token || (await requestNewAccessToken());
  } catch (e) {
    return handleError(getOrRequestAccessToken.name, e);
  }
};

const me = async () => {
  try {
    const access_token = await getOrRequestAccessToken();
    const { data } = await axios.get(`${URLS.MAIN}/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (e) {
    return handleError(me.name, e);
  }
};

const playlists = async (limit) => {
  try {
    const access_token = await getOrRequestAccessToken();
    const { data } = await axios.get(`${URLS.MAIN}/me/playlists`, {
      params: { limit },
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (e) {
    return handleError(me.name, e);
  }
};

const topItems = async ({ type, time_range, limit }) => {
  try {
    const access_token = await getOrRequestAccessToken();
    const { data } = await axios.get(`${URLS.MAIN}/me/top/${type}`, {
      params: { limit, time_range },
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (e) {
    return handleError(me.name, e);
  }
};

module.exports = { requestNewAccessToken, me, playlists, topItems };
