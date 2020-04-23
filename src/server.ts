import bodyParser from 'body-parser';
import compression from 'compression';
import connect from 'connect';
import { config as populateProcessEnv } from 'dotenv';
import fs from 'fs';
import http from 'http'
import httpProxy from 'http-proxy';
import httpsProxyAgent from 'https-proxy-agent';
import path from 'path';
import URL from 'url';
import streamArray = require('stream-array');
import { getConfig, printConfig } from './config';
import { proxyHandler } from './handler';

// Populate environment variable from dotenv file if applicable
try {
  populateProcessEnv({ path: path.join(__dirname, '../.env') });
} catch (ex) {
  console.log('Unable to load dotenv', ex);
}

const config = getConfig();
const proxyUrl = config.customHttpProxy || config.httpProxy;
const httpProxyValue = proxyUrl && URL.parse(proxyUrl);
if (httpProxyValue) {
  httpProxyValue.protocol = httpProxyValue && httpProxyValue.protocol && httpProxyValue.protocol.replace(/:$/, '');
}
const agentOptions = {
  cert: config.proxyCert && fs.readFileSync(config.proxyCert),
  key: config.proxyKey && fs.readFileSync(config.proxyKey),
  passphrase: config.proxyPassphrase,
  ca: config.proxyCA && fs.readFileSync(config.proxyCA)
}
// @ts-ignore
const httpProxyAgent = httpProxyValue ? new httpsProxyAgent({ ...httpProxyValue, ...agentOptions}) : false;
const proxyWithAgentOptions = {
  toProxy: config.toProxy, agent: httpProxyAgent,
};
const basePath = `https://${config.gateway1Host}:${config.gateway1Port}/${config.gateway1UrlPrefix || ""}`;
let targetPath = URL.parse(basePath);
if (!config.gatewayIsSingle) {
  targetPath.path += `${config.gateway2UrlPrefix}`;
}
const proxyOptions = Object.assign({
  target: {... targetPath,...agentOptions},
  secure: config.secure,
  timeout: config.timeout,
  proxy_timeout: config.proxyTimeout,
}, config.useProxyAgent && proxyWithAgentOptions);

const proxy = httpProxy.createProxyServer(proxyOptions);
proxy.on('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
  if (config.debug) {
    console.log(Object.assign({ type: 'on.proxyReq' }, { headers: proxyReq.getHeaders() }));
  }

  try {
    return proxyHandler(proxyReq, req, config);
  } catch (ex) {
    console.error(ex);
  }
});

proxy.on('proxyRes', (proxyRes: http.IncomingMessage, req: http.IncomingMessage, res: http.ServerResponse) => {
  if (config.debug) {
    console.info('[proxyRes debug]');
    console.log(Object.assign({ type: 'on.proxyRes' }, { headers: proxyRes.headers }, {
      statusCode: proxyRes.statusCode,
      statusMessage: proxyRes.statusMessage,
      httpVersion: proxyRes.httpVersion,
    }));
  }
});

proxy.on('error', (err, req: http.IncomingMessage, res) => {
  console.info('[proxy error]');
  console.log(err);
  console.log(req);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(err));
});

const app = connect();
app.use((req, _, next) => {
  if (req.headers['content-encoding'] === 'gzip') {
    req.on('data', (chunk) => {
      if (!req.rawBody) {
        req.rawBody = chunk;
      } else {
        req.rawBody += chunk;
      }
    });
  }
  next();
});
app.use(bodyParser.json({ limit: config.bodyLimitSize }));
app.use(bodyParser.urlencoded({ extended: true, limit: config.bodyLimitSize }));
app.use((req, res, next) => {
  const webProxyOptions: httpProxy.ServerOptions = {
    changeOrigin: true,
  };
  if (req.headers['content-encoding'] === 'gzip') {
    webProxyOptions.buffer = streamArray([req.rawBody]);
    webProxyOptions.headers = {
      'content-type': 'application/octet-stream',
    };
  }
  proxy.web(req, res, webProxyOptions, next);
});
app.use(compression({ filter: () => true }));
app.use((err, _req, res, next) => {
  if (err) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
  } else {
    next();
  }
});

export const server = http.createServer(app);

printConfig();
server.listen(config.localPort);
