import path from 'path';
import { DEFAULT_MODE } from './constants';
import { IConfig } from './types';
import { isTruthy } from './utils';

export const getConfig = ():IConfig => {
  const {
    DEBUG,
    SECURE,
    BODY_LIMIT_SIZE,
    AUTH_MODE,
    LOCAL_PORT,

    GATEWAY_1_HOST,
    GATEWAY_1_PORT,
    GATEWAY_1_TYPE,
    GATEWAY_1_URL_PREFIX,
    GATEWAY_1_APP_ID,
    GATEWAY_1_SECRET,
    GATEWAY_1_KEY_STRING,
    GATEWAY_1_KEY_FILE,
    GATEWAY_1_PASSPHRASE,

    GATEWAY_2_HOST,
    GATEWAY_2_PORT,
    GATEWAY_2_TYPE,
    GATEWAY_2_URL_PREFIX,
    GATEWAY_2_APP_ID,
    GATEWAY_2_SECRET,
    GATEWAY_2_KEY_STRING,
    GATEWAY_2_KEY_FILE,
    GATEWAY_2_PASSPHRASE,
  } = process.env;

  return {
    debug: isTruthy(DEBUG),
    secure: isTruthy(SECURE),
    body_limit_size: BODY_LIMIT_SIZE ? BODY_LIMIT_SIZE : '4200kb',
    mode: AUTH_MODE || DEFAULT_MODE,
    localPort: LOCAL_PORT,

    gateway1Host: GATEWAY_1_HOST,
    gateway1Port: GATEWAY_1_PORT,
    gateway1Type: GATEWAY_1_TYPE,
    gateway1UrlPrefix: GATEWAY_1_URL_PREFIX,
    gateway1AppId: GATEWAY_1_APP_ID,
    gateway1Secret: GATEWAY_1_SECRET ? GATEWAY_1_SECRET : undefined,
    gateway1KeyString: GATEWAY_1_KEY_STRING ? GATEWAY_1_KEY_STRING : undefined,
    gateway1KeyFile: GATEWAY_1_KEY_FILE ? path.join(__dirname, '..', GATEWAY_1_KEY_FILE) : undefined,
    gateway1Passphrase: GATEWAY_1_PASSPHRASE ? GATEWAY_1_PASSPHRASE : undefined,

    gateway2Host: GATEWAY_2_HOST,
    gateway2Port: GATEWAY_2_PORT,
    gateway2Type: GATEWAY_2_TYPE,
    gateway2UrlPrefix: GATEWAY_2_URL_PREFIX,
    gateway2AppId: GATEWAY_2_APP_ID,
    gateway2Secret: GATEWAY_2_SECRET ? GATEWAY_2_SECRET : undefined,
    gateway2KeyString: GATEWAY_2_KEY_STRING ? GATEWAY_2_KEY_STRING : undefined,
    gateway2KeyFile: GATEWAY_2_KEY_FILE ? path.join(__dirname, '..', GATEWAY_2_KEY_FILE) : undefined,
    gateway2Passphrase: GATEWAY_2_PASSPHRASE ? GATEWAY_2_PASSPHRASE : undefined,
  };
};

export const printConfig = () => {
  const config = getConfig();
  console.log(`Debug Mode: ${config.debug}`);
  console.log(`Secure Mode: ${config.secure}`);
  console.log(`Auth Mode: ${config.mode}`);
  console.log(`Server listening on port ${config.localPort}`);
};

export default getConfig; 
