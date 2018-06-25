import { DEFAULT_MODE } from './constants';
import { IConfig } from './types';
import { isTruthy } from './utils';
import path from 'path';

export const getConfig = ():IConfig => {
  const {
    AUTH_MODE,
    LOCAL_PORT,
    TARGET_HOST,
    TARGET_PORT,
    APP_ID,
    L1_INTERNAL,
    L1_SECRET,
    L2_INTERNAL,
    L2_KEY_FILE,
    L2_KEY_STRING,
    DEBUG,
  } = process.env;

  return {
    debug: isTruthy(DEBUG),
    mode: AUTH_MODE || DEFAULT_MODE,
    localPort: LOCAL_PORT,
    host: TARGET_HOST,
    port: TARGET_PORT,
    appId: APP_ID,
    l1internal: isTruthy(L1_INTERNAL),
    secret: L1_SECRET ? L1_SECRET : undefined ,
    l2internal: isTruthy(L2_INTERNAL),
    keyFile: L2_KEY_FILE ? path.join(__dirname, '..', L2_KEY_FILE) : undefined ,
    keyString: L2_KEY_STRING ? L2_KEY_STRING : undefined ,
  };
}

export const printConfig = () => {
  const config = getConfig();
  console.log(`Debug Mode: ${config.debug}`);
  console.log(`Auth Mode: ${config.mode}`);
  console.log(`L1 Auth Enabled: ${!!config.secret}`);
  console.log(`L2 Auth Enabled: ${!!(config.keyFile||config.keyString)}`);
  console.log(`Target: ${config.host}:${config.port}`);
  console.log(`Server listening on port ${config.localPort}`);
}

export default getConfig;