import { DEFAULT_MODE } from './constants';
import { IConfig } from './types';
import { isTruthy } from './utils';

export default ():IConfig => {
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
  } = process.env;

  return {
    mode: AUTH_MODE || DEFAULT_MODE,
    localPort: LOCAL_PORT,
    host: TARGET_HOST,
    port: TARGET_PORT,
    appId: APP_ID,
    l1internal: isTruthy(L1_INTERNAL),
    secret: L1_SECRET ? L1_SECRET : undefined ,
    l2internal: isTruthy(L2_INTERNAL),
    keyFile: L2_KEY_FILE ? L2_KEY_FILE : undefined ,
    keyString: L2_KEY_STRING ? L2_KEY_STRING : undefined ,
  };
}