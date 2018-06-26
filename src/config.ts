import { DEFAULT_MODE } from './constants';
import { IConfig } from './types';
import { isTruthy } from './utils';
import path from 'path';

export const getConfig = ():IConfig => {
  const {
    DEBUG,
    SECURE,
    AUTH_MODE,
    LOCAL_PORT,
    TARGET_HOST,
    TARGET_PORT,

    GATEWAY_1_TYPE,
    GATEWAY_1_URL_PREFIX,
    GATEWAY_1_APP_ID,
    GATEWAY_1_SECRET,
    GATEWAY_1_KEY_STRING,
    GATEWAY_1_KEY_FILE,
    
    GATEWAY_2_TYPE,
    GATEWAY_2_URL_PREFIX,
    GATEWAY_2_APP_ID,
    GATEWAY_2_SECRET,
    GATEWAY_2_KEY_STRING,
    GATEWAY_2_KEY_FILE,

  } = process.env;

  return {
    debug: isTruthy(DEBUG),
    secure: isTruthy(SECURE),
    mode: AUTH_MODE || DEFAULT_MODE,
    localPort: LOCAL_PORT,
    host: TARGET_HOST,
    port: TARGET_PORT,

    gateway1Type: GATEWAY_1_TYPE,
    gateway1UrlPrefix: GATEWAY_1_URL_PREFIX,
    gateway1AppId: GATEWAY_1_APP_ID,
    gateway1Secret: GATEWAY_1_SECRET,
    gateway1KeyString: GATEWAY_1_KEY_STRING,
    gateway1KeyFile: GATEWAY_1_KEY_FILE,

    gateway2Type: GATEWAY_2_TYPE,
    gateway2UrlPrefix: GATEWAY_2_URL_PREFIX,
    gateway2AppId: GATEWAY_2_APP_ID,
    gateway2Secret: GATEWAY_2_SECRET,
    gateway2KeyString: GATEWAY_2_KEY_STRING,
    gateway2KeyFile: GATEWAY_2_KEY_FILE,
  };
}

export const printConfig = () => {
  const config = getConfig();
  console.log(`Debug Mode: ${config.debug}`);
  console.log(`Secure Mode: ${config.secure}`);
  console.log(`Auth Mode: ${config.mode}`);
  console.log(`Target: ${config.host}:${config.port}`);
  console.log(`Server listening on port ${config.localPort}`);
}

export default getConfig; 
