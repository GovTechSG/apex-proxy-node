import {get} from 'lodash';
import http from 'http';
import httpProxy from 'http-proxy';
import {ApiSigningUtil} from 'node-apex-api-security';

const MODE = {
  REWRITE: 'REWRITE',
  APPEND: 'APPEND',
}

const AUTH_PREFIX = {
  L1:{
    INTERNAL: 'apex_l1_ig',
    EXTERNAL: 'apex_l1_eg',
  },
  L2:{
    INTERNAL: 'apex_l2_ig',
    EXTERNAL: 'apex_l2_eg',
  }
}

const DEFAULT_MODE = MODE.REWRITE;




/*
=============================================================================
*/

export interface IConfig {
  localPort: string;
  // REWRITE or APPEND Signature to Authorization header
  mode: string;

  // Target to forward request to
  host: string;
  port: string;

  // App ID in Apex
  appId: string;

  // For L1 Authentication
  l1internal?: boolean;
  secret?: string;

  // For L2 Authentication
  l2internal?: boolean;
  keyString?: string;
}

const config: IConfig = {
  localPort: '1337',
  mode: MODE.APPEND,
  host: 'localhost',
  port: '8080',
  appId: 'sampleAppId',
  
  l1internal: true,
  secret: 'sampleSecret',

  l2internal: false,
  keyString: `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAuSvK8qsguDK5B1qIA1ob105zTAUw/frJRSHmFa500yXxG/qR
YIXiJ72XMqxqf5QqbdJj2uZV3vmuzHzy2ZZGP5+vMvNF57YoFiIT1XEa6TvS4F6J
tJDcl3RvPR9DB/eOr4GNRAQTlkX0WNB//4O31ALoqifD+V1MU07exS8hoIpTHj/p
oL+9DJP2HUcvFEq3IYVB2H/rEnD9piB8Ke1dwmm53fs9nt/JZUY0kWZT+yiWRkzB
MaaMPMWvSa43IYMcS6nfQrTP0O8tkHkZk3nMOe7c40qWZZ7MmLKSBTAqRzaIuVz+
/XmfsAgXTv+UcIKhInCriJJgA+3Rjun8bczUGQIDAQABAoIBACwQErQaKqgKUeNB
FLqPd66NWXxOg/D7+2b7ARBJuj0Ae1ZoEq4ATeedAtypEJKZRFtrxB0z0F1F1uWM
GhHS45aCPiOGpizUOMfDhiq1Rm0Xsj9335bbHdLgfxPxW3cK3qY+0snLmomYzeNQ
ghTgWB8YLhtHaSfunpn4W6RaacsUl0ts0/XCRjBBSJzUyJhtGF8BfJvCh25V7LPm
TQg59Fbmf2wUgyEMbD43mqiY50wpBor7JTx6RrY4SmquZz/SksvPvqoZgzU3NJA3
S03q+9Uxah3BXFppZDyLZkP8WXCOEMxqDlsSqAuUpfcRpJIq49mOaNPg1F0/wM+8
/wCiQD0CgYEA71LI0/LhnA2l+oOloGbpI02tCeaJM5HmfzQ85dTU0b1YQUsjUGPk
fi1A2lNO5ZkBGqpLhpgZp5TyAHFHbEixxPPugJL9fhLk/n1OPz9c3t/Vn8hs/jab
HoVBjJJvCG9Knt7Kq5TV+8e9XZWtFV5SsGt7rCsXeUBI/CeUcmugsrcCgYEAxhMA
glLnzGoVFjUxxu4H0hs4u1CDzheTB4RwQL/pcQj6Ud9sRTEjwNeIculpOz9+6rFu
on/zPacBjc0kuJbUjGhigT5dMWy15NIQ15Vs9PdBttsmLp6DRGTV6gcsZo90hINP
H9ylwYRgK+5qnd6ijZtbuDL8ZkMkKvQI4gSln68Cf3L8U4GCMOPJqvWySuHGkD1m
FL2tBj7A2v5DGv9SQu6DCuRUNaNqW15EX+SGImIuIVmueJsyeSELbzrHMonUY5U9
nlooRaNNcLjVe8Lnrrdm1DzxD20Uz3Lak6P2t2JWFoQ+hyHpYOaYEWPlhkO+Dfy1
p7YQ/jZDrM16NtjC3XMCgYEAtZZiFxhObbarUkq+MbOy88oE/qTX0S8HmhKuno3S
Q9CJPFnp9p0QPBDchQy7bpfNkPfNh6hppRHgeNGjYp7UiUyBUh+MbG1PbFGxIxNY
alPrqOnMXVzw1tjiy8R7ziKiHYIMHhe41mq3iE7w635Z5ByTv5DumAnhtIc5RYwh
Ev0CgYEAk016o7dki7RZW/vFC0tpMNwAfuY7+ipku4SKKnSBrwKduG87awj1fWfb
+jtUs0SEe2CgDZ0TqEvcwwdPEgU+kiLd4eCHGltLICKv4QW1SzNQGw1ymFw00Jhz
mRKVKyKX+CFFETfNykUdiEbHZL0GkcQOpkWHbwrxfYuDOrbwchw=
-----END RSA PRIVATE KEY-----
`,
}

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
  const { appId, keyString, l2internal } = config;
  const authPrefix = l2internal ? AUTH_PREFIX.L2.INTERNAL : AUTH_PREFIX.L2.EXTERNAL;

  if(!keyString || !appId) return;
  const opts = {
    appId,
    keyString,
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