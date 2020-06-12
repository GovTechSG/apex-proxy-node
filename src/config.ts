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

    GATEWAY_IS_SINGLE,
    GATEWAY_1_HOST,
    GATEWAY_1_SIGNING_HOST,
    GATEWAY_1_PORT,
    GATEWAY_1_TYPE,
    GATEWAY_1_URL_PREFIX,
    GATEWAY_1_APP_ID,
    GATEWAY_1_SECRET,
    GATEWAY_1_KEY_STRING,
    GATEWAY_1_KEY_FILE,
    GATEWAY_1_PASSPHRASE,

    GATEWAY_2_HOST,
    GATEWAY_2_SIGNING_HOST,
    GATEWAY_2_PORT,
    GATEWAY_2_TYPE,
    GATEWAY_2_URL_PREFIX,
    GATEWAY_2_APP_ID,
    GATEWAY_2_SECRET,
    GATEWAY_2_KEY_STRING,
    GATEWAY_2_KEY_FILE,
    GATEWAY_2_PASSPHRASE,

    CUSTOM_HEADER_KEY,
    CUSTOM_HEADER_VALUE,
    BASIC_AUTH_HEADER_VALUE,

    HTTP_PROXY,
    CUSTOM_HTTP_PROXY,
    USE_PROXY_AGENT,
    TO_PROXY,
    TIMEOUT,
    PROXY_TIMEOUT,
    PROXY_CERT,
    PROXY_KEY,
    PROXY_CA,
    PROXY_PASSPHRASE,
  } = process.env;

  return {
    debug: isTruthy(DEBUG),
    secure: isTruthy(SECURE),
    bodyLimitSize: BODY_LIMIT_SIZE ? BODY_LIMIT_SIZE : '4200kb',
    mode: AUTH_MODE || DEFAULT_MODE,
    localPort: LOCAL_PORT,

    gatewayIsSingle: isTruthy(GATEWAY_IS_SINGLE),
    gateway1Host: GATEWAY_1_HOST,
    gateway1SigningHost: GATEWAY_1_SIGNING_HOST,
    gateway1Port: GATEWAY_1_PORT ? Number(GATEWAY_1_PORT) : 443,
    gateway1Type: GATEWAY_1_TYPE,
    gateway1UrlPrefix: GATEWAY_1_URL_PREFIX,
    gateway1AppId: GATEWAY_1_APP_ID,
    gateway1Secret: GATEWAY_1_SECRET ? GATEWAY_1_SECRET : undefined,
    gateway1KeyString: GATEWAY_1_KEY_STRING ? GATEWAY_1_KEY_STRING : undefined,
    gateway1KeyFile: GATEWAY_1_KEY_FILE ? path.join(__dirname, '..', GATEWAY_1_KEY_FILE) : undefined,
    gateway1Passphrase: GATEWAY_1_PASSPHRASE ? GATEWAY_1_PASSPHRASE : undefined,

    gateway2Host: GATEWAY_2_HOST,
    gateway2SigningHost: GATEWAY_2_SIGNING_HOST,
    gateway2Port: GATEWAY_2_PORT ? Number(GATEWAY_2_PORT) : 443,
    gateway2Type: GATEWAY_2_TYPE,
    gateway2UrlPrefix: GATEWAY_2_URL_PREFIX,
    gateway2AppId: GATEWAY_2_APP_ID,
    gateway2Secret: GATEWAY_2_SECRET ? GATEWAY_2_SECRET : undefined,
    gateway2KeyString: GATEWAY_2_KEY_STRING ? GATEWAY_2_KEY_STRING : undefined,
    gateway2KeyFile: GATEWAY_2_KEY_FILE ? path.join(__dirname, '..', GATEWAY_2_KEY_FILE) : undefined,
    gateway2Passphrase: GATEWAY_2_PASSPHRASE ? GATEWAY_2_PASSPHRASE : undefined,

    basicAuthHeaderValue: BASIC_AUTH_HEADER_VALUE ? BASIC_AUTH_HEADER_VALUE : undefined,
    customHeaderKey: CUSTOM_HEADER_KEY ? CUSTOM_HEADER_KEY : undefined,
    customHeaderValue: CUSTOM_HEADER_VALUE ? CUSTOM_HEADER_VALUE : undefined,


    httpProxy: HTTP_PROXY,
    customHttpProxy: CUSTOM_HTTP_PROXY,
    useProxyAgent: isTruthy(USE_PROXY_AGENT),
    toProxy: isTruthy(TO_PROXY),
    timeout: TIMEOUT ? Number(TIMEOUT) || 30000 : 30000,
    proxyTimeout: PROXY_TIMEOUT ? Number(PROXY_TIMEOUT) || 30000 : 30000,
    proxyCert: PROXY_CERT ? PROXY_CERT: undefined,
    proxyKey: PROXY_KEY ? PROXY_KEY : undefined,
    proxyCA: PROXY_CA ? PROXY_CA : undefined,
    proxyPassphrase: PROXY_PASSPHRASE,
  };
};

export const printConfig = () => {
  const config = getConfig();
  console.log(`Debug Mode: ${config.debug}`);
  console.log(`Secure Mode: ${config.secure}`);
  console.log(`Auth Mode: ${config.mode}`);
  console.log(`Single Gateway: ${config.gatewayIsSingle}`);
  console.log(`Use Proxy: ${config.useProxyAgent}`);
  console.log(`Proxy: ${(config.customHttpProxy && 'Custom Proxy') || (config.httpProxy && 'HTTP_PROXY')}`);
  console.log(`toProxy: ${config.toProxy}`);
  console.log(`timeout: ${config.timeout}`);
  console.log(`proxyTimeout: ${config.proxyTimeout}`);
  console.log(`Server listening on port ${config.localPort}`);
};

export default getConfig; 
