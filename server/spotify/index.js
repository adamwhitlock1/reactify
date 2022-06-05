require('dotenv').config();
const axios = require('axios');

const { readTokenStorage, writeTokenStorage } = require('../storage');

const URLS = {
  MAIN: 'https://api.spotify.com/v1',
  TOKEN: 'https://accounts.spotify.com/api/token',
};

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  MUSIXMATCH_API,
  REFRESH_TOKEN,
} = process.env;

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

    console.log('SUCCESS!', { access_token, expires_in });
    await writeTokenStorage({ access_token, expires_in });
    return { access_token, expires_in };
  } catch (e) {
    console.error('ERROR REQUESTING NEW ACCESS TOKEN', e);
    throw new Error('ERROR REQUESTING NEW ACCESS TOKEN');
  }
};

module.exports = { requestNewAccessToken };
