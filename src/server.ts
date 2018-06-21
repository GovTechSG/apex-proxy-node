import {config as populateProcessEnv} from 'dotenv';
import http from 'http';
import httpProxy from 'http-proxy';
import path from 'path';
import getConfig from './config';
import {proxyHandler} from './handler';

// Populate environment variable from dotenv file if applicable
try {
  populateProcessEnv({path: path.join(__dirname, '../.env')});
} catch (ex) {
  console.log('Unable to load dotenv', ex);
}

const config = getConfig();

const proxy = httpProxy.createProxyServer({
  target:{
    host: config.host,
    port: config.port,
  },
});

proxy.on('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
  proxyHandler(proxyReq, req, config);
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

console.log(`Listening on port ${config.localPort}`);
server.listen(config.localPort);