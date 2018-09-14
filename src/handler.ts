import http from 'http';
import {get} from 'lodash';
import {ApiSigningUtil} from 'node-apex-api-security';
import {stringify} from 'querystring';
import {
  AUTH_PREFIX,
  MODE,
} from './constants';
import {IConfig} from './types';
import {printOpts} from './utils';

export const sign = ({
  type,
  secret,
  keyFile,
  keyString,
  passphrase,
  appId,
  httpMethod,
  urlPath,
}, config?) => {
  let authPrefix;
  if(type === 'INTERNAL'){
    if(secret){
      authPrefix = AUTH_PREFIX.L1.INTERNAL;
    }else{
      authPrefix = AUTH_PREFIX.L2.INTERNAL;
    }
  }else{
    if(secret){
      authPrefix = AUTH_PREFIX.L1.EXTERNAL;
    }else{
      authPrefix = AUTH_PREFIX.L2.EXTERNAL;
    }
  }

  const opts = {
    appId,
    secret,
    keyString,
    keyFile,
    passphrase,
    httpMethod,
    authPrefix,
    urlPath,
  };

  if(config && config.debug){
    printOpts(opts);
  }
  return ApiSigningUtil.getSignatureToken(opts);
};

export const firstGateSignature = (req: http.IncomingMessage, config: IConfig): string | undefined => {
  if(!config.gateway1AppId || !(config.gateway1Secret
    || config.gateway1KeyFile || config.gateway1KeyString)) { return; }

  const { method, url } = req;
  const {
    gateway1SigningHost,
    gateway1Port,
    gateway1UrlPrefix,
    gateway2UrlPrefix,
    gateway1Type,
    gateway1AppId,
    gateway1Secret,
    gateway1KeyString,
    gateway1KeyFile,
    gateway1Passphrase,
  } = config;

  const urlPath = `https://${gateway1SigningHost}:${gateway1Port}/${gateway1UrlPrefix}/${gateway2UrlPrefix}${url}`;
  return sign({
    type: gateway1Type,
    secret: gateway1Secret,
    keyFile: gateway1KeyFile,
    keyString: gateway1KeyString,
    passphrase: gateway1Passphrase,
    appId: gateway1AppId,
    httpMethod: method,
    urlPath,
  }, config);
};

export const secondGateSignature = (req: http.IncomingMessage, config: IConfig): string | undefined => {
  if(!config.gateway2AppId || !(config.gateway2Secret
    || config.gateway2KeyFile || config.gateway2KeyString)) { return; }

  const { method, url } = req;
  const {
    gateway2SigningHost,
    gateway2Port,
    gateway2UrlPrefix,
    gateway2Type,
    gateway2AppId,
    gateway2Secret,
    gateway2KeyString,
    gateway2KeyFile,
    gateway2Passphrase,
  } = config;

  const urlPath = `https://${gateway2SigningHost}:${gateway2Port}/${gateway2UrlPrefix}${url}`;
  return sign({
    type: gateway2Type,
    secret: gateway2Secret,
    keyFile: gateway2KeyFile,
    keyString: gateway2KeyString,
    passphrase: gateway2Passphrase,
    appId: gateway2AppId,
    httpMethod: method,
    urlPath,
  }, config);
};

export const proxyHandler = (
  proxyReq: http.ClientRequest,
  req: http.IncomingMessage,
  config: IConfig
) => {
  console.log('in proxy');
  proxyReq.setHeader('Host', config.gateway1Host);

  const gate1Signature = firstGateSignature(req, config);
  const gate2Signature = secondGateSignature(req, config);
  const signature = (gate1Signature && gate2Signature) ?
  `${gate1Signature}, ${gate2Signature}` : gate1Signature || gate2Signature;

  if(signature && config.mode === MODE.REWRITE){
    proxyReq.setHeader('Authorization', signature);
  }else if(signature && config.mode === MODE.APPEND){
    const authorization = get(req, 'headers.authorization');
    proxyReq.setHeader('Authorization', authorization ? `${signature}, ${authorization}` : signature);
  }

  const body = get(req, 'body');
  if(body){
    const contentType = proxyReq.getHeader('Content-Type');
    let bodyData;

    if (contentType === 'application/json') {
      bodyData = JSON.stringify(body);
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      bodyData = stringify(body);
    }
    if (bodyData) {
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
};
