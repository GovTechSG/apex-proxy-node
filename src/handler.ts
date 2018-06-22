import {
  MODE,
  AUTH_PREFIX,
} from './constants';
import {IConfig} from './types';
import http from 'http';
import {get} from 'lodash';
import {ApiSigningUtil} from 'node-apex-api-security';

export const l1Signature = (req: http.IncomingMessage, config: IConfig): string | undefined => {
  const { method, url } = req;
  const { appId, secret, l1internal } = config;
  const authPrefix = l1internal ? AUTH_PREFIX.L1.INTERNAL : AUTH_PREFIX.L1.EXTERNAL;
  if(!secret || !appId) return;
  const opts = {
    appId,
    secret,
    authPrefix,
    httpMethod: method,
    urlPath: `http://${config.host}:${config.port}${url}`,
  };
  return ApiSigningUtil.getSignatureToken(opts);
}

export const l2Signature = (req: http.IncomingMessage, config: IConfig): string | undefined => {
  const { method, url } = req;
  const { appId, keyString, keyFile, l2internal } = config;
  const authPrefix = l2internal ? AUTH_PREFIX.L2.INTERNAL : AUTH_PREFIX.L2.EXTERNAL;

  if(!(keyString || keyFile) || !appId) return;
  const opts = {
    appId,
    keyString,
    keyFile,
    authPrefix,
    httpMethod: method,
    urlPath: `http://${config.host}:${config.port}${url}`,
  };
  return ApiSigningUtil.getSignatureToken(opts);
}

export const proxyHandler = (
  proxyReq: http.ClientRequest,
  req: http.IncomingMessage,
  config: IConfig
) => {
  proxyReq.setHeader('Host', config.host);
  const signatureL1 = l1Signature(req, config);
  const signatureL2 = l2Signature(req, config);
  const signature = (signatureL1 && signatureL2) ? `${signatureL1}, ${signatureL2}` : signatureL1 || signatureL2;

  if(signature && config.mode === MODE.REWRITE){
    proxyReq.setHeader('Authorization', signature);
  }else if(signature && config.mode === MODE.APPEND){
    const authorization = get(req, 'headers.authorization');
    proxyReq.setHeader('Authorization', authorization ? `${signature}, ${authorization}` : signature);
  }
}