import {config as populateProcessEnv} from 'dotenv';
import http from 'http';
import httpProxy from 'http-proxy';
import path from 'path';
import {getConfig, printConfig} from './config';
import {proxyHandler} from './handler';
import {get} from 'lodash';
import connect from 'connect';
import bodyParser from 'body-parser';

// Populate environment variable from dotenv file if applicable
try {
  populateProcessEnv({path: path.join(__dirname, '../.env')});
} catch (ex) {
  console.log('Unable to load dotenv', ex);
}

const config = getConfig();

const proxy = httpProxy.createProxyServer({
  target: `https://${config.host}:${config.port}/${config.gateway1UrlPrefix}/${config.gateway2UrlPrefix}`,
  secure: config.secure,
});

proxy.on('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
  proxyHandler(proxyReq, req, config);
});

proxy.on('proxyRes', (proxyRes: http.IncomingMessage) => {
  config.debug && console.log(get(proxyRes, 'req._header'));
});

proxy.on('error', (err, req: http.IncomingMessage) => {
  console.log(err);
  console.log(req);
});

const app = connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res) => proxy.web(req, res, {
  changeOrigin: true,
}));

const server = http.createServer(app);

printConfig();
server.listen(config.localPort);
