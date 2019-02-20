import bodyParser from 'body-parser';
import compression from 'compression';
import connect from 'connect';
import {config as populateProcessEnv} from 'dotenv';
import http from 'http';
import httpProxy from 'http-proxy';
import httpsProxyAgent from 'https-proxy-agent';
import path from 'path';
import streamArray = require('stream-array');
import {getConfig, printConfig} from './config';
import {proxyHandler} from './handler';

// Populate environment variable from dotenv file if applicable
try {
  populateProcessEnv({path: path.join(__dirname, '../.env')});
} catch (ex) {
  console.log('Unable to load dotenv', ex);
}

const config = getConfig();
const httpProxyValue = config.customHttpProxy || config.httpProxy;
const httpProxyAgent = httpProxyValue ? new httpsProxyAgent(httpProxyValue) : false;
const proxyWithAgentOptions = { toProxy: config.toProxy, agent: httpProxyAgent};
const proxyOptions = Object.assign({
  // tslint:disable-next-line:max-line-length
  target: `https://${config.gateway1Host}:${config.gateway1Port}/${config.gateway1UrlPrefix}/${config.gateway2UrlPrefix}`,
  secure: config.secure,
  timeout: config.timeout,
  proxy_timeout: config.proxyTimeout,
}, config.useProxyAgent && proxyWithAgentOptions);

console.log({proxyOptions});
const proxy = httpProxy.createProxyServer(proxyOptions);

proxy.on('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
  if(config.debug) {
    console.log(Object.assign({type: 'on.proxyReq'}, {headers:proxyReq.getHeaders()}));
  }
  proxyHandler(proxyReq, req, config);
});

proxy.on('proxyRes', (proxyRes: http.IncomingMessage) => {
  if(config.debug){
    console.info('[proxyRes debug]');
    console.log(Object.assign({type: 'on.proxyRes'}, {headers: proxyRes.headers}, {
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
app.use((req, res, next) => {
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
app.use(bodyParser.json({limit: config.bodyLimitSize}));
app.use(bodyParser.urlencoded({extended: true, limit: config.bodyLimitSize}));
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
app.use(compression({filter: () => true}));
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
