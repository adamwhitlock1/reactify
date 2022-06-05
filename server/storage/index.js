const fs = require('fs').promises;
const path = require('path');
const datefns = require('date-fns');

const storagePath = path.resolve(__dirname, './token.json');

const readTokenStorage = async () => {
  try {
    const fileContents = await fs.readFile(storagePath, {
      encoding: 'utf8',
      flag: 'r',
    });

    return JSON.parse(fileContents);
  } catch (e) {
    throw new Error('failed reading file');
  }
};

const writeTokenStorage = async ({
  access_token = 'none',
  expires_in = '3600',
  time_stamp = Date.now(),
}) => {
  try {
    const payload = { access_token, expires_in, time_stamp };
    await fs.writeFile(storagePath, JSON.stringify(payload));
    console.log('writing to token.json successful!');
    console.log('wrote', payload);
  } catch (e) {
    console.error(e);
    throw new Error('failed to writeTokenStorage');
  }
};

const isTimestampExpired = async () => {
  const { time_stamp } = await readTokenStorage();

  const shouldRefresh = datefns.isAfter(
    new Date(),
    datefns.add(time_stamp, { minutes: 59, seconds: 30 })
  );

  return { shouldRefresh, time_stamp };
};

module.exports = { readTokenStorage, writeTokenStorage, isTimestampExpired };
