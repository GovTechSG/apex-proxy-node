import {config as populateProcessEnv} from 'dotenv';
import {get} from 'lodash';
import http from 'http';
import httpProxy from 'http-proxy';
import {ApiSigningUtil} from 'node-apex-api-security';
import path from 'path';
import {
  MODE,
  AUTH_PREFIX,
} from './constants';
import {IConfig} from './types';
import getConfig from './config';

// Populate environment variable from dotenv file if applicable
try {
  populateProcessEnv({path: path.join(__dirname, '../.env')});
} catch (ex) {
  console.log('Unable to load dotenv', ex);
}

const config = getConfig();
console.log("Config:", config);

const proxy = httpProxy.createProxyServer({
  target:{
    host: config.host,
    port: config.port,
  },
});

const l1Signature = (req: http.IncomingMessage, config: IConfig): string | undefined => {
  const { method, url } = req;
  const { appId, secret, l1internal } = config;
  const authPrefix = l1internal ? AUTH_PREFIX.L1.INTERNAL : AUTH_PREFIX.L1.EXTERNAL;

  if(!secret || !appId) return;
  const opts = {
    appId,
    secret,
    authPrefix,
    httpMethod: method,
    urlPath: url,
  };
  return ApiSigningUtil.getSignatureToken(opts);
}

const l2Signature = (req: http.IncomingMessage, config: IConfig): string | undefined => {
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
    urlPath: url,
  };
  return ApiSigningUtil.getSignatureToken(opts);
}

proxy.on('proxyReq', (proxyReq, req) => {
  const signatureL1 = l1Signature(req, config);
  const signatureL2 = l2Signature(req, config);
  const signature = (signatureL1 && signatureL2) ? `${signatureL1}, ${signatureL2}` : signatureL1 || signatureL2;

  if(signature && config.mode === MODE.REWRITE){
    proxyReq.setHeader('Authorization', signature);
  }else if(signature && config.mode === MODE.APPEND){
    const authorization = get(req, 'headers.authorization');
    proxyReq.setHeader('Authorization', authorization ? `${signature}, ${authorization}` : signature);
  }
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

console.log(`Listening on port ${config.localPort}`);
server.listen(config.localPort);