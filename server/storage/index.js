const fs = require('fs');
const path = require('path');

const storagePath = path.resolve(__dirname, './token.json');

const readTokenStorage = () => {
  try {
    return JSON.parse(
      fs.readFileSync(storagePath, { encoding: 'utf8', flag: 'r' })
    );
  } catch (e) {
    throw new Error('failed reading file');
  }
};

const writeTokenStorage = ({
  access_token = 'none',
  expires_in = '3600',
  time_stamp = Date.now(),
}) => {
  try {
    const { refresh_token } = readTokenStorage();

    const payload = { access_token, expires_in, time_stamp, refresh_token };
    fs.writeFileSync(storagePath, JSON.stringify(payload));
    console.log('writing to token.json successful!');
    console.log('wrote', payload);
  } catch (e) {
    console.error(e);
    throw new Error('failed to writeTokenStorage');
  }
};

module.exports = { readTokenStorage, writeTokenStorage };
