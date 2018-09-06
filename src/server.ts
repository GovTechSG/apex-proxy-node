import bodyParser from 'body-parser';
import HttpProxyAgent from 'http-proxy-agent';
import ProxyAgent from 'proxy-agent';
import connect from 'connect';
import {config as populateProcessEnv} from 'dotenv';
import http from 'http';
import httpProxy from 'http-proxy';
import {get} from 'lodash';
import path from 'path';
import {getConfig, printConfig} from './config';
import {proxyHandler} from './handler';


// Populate environment variable from dotenv file if applicable
try {
  populateProcessEnv({path: path.join(__dirname, '../.env')});
} catch (ex) {
  console.log('Unable to load dotenv', ex);
}

const config = getConfig();
const http_proxy = process.env.HTTP_PROXY;
const httpProxyAgent = http_proxy ? new ProxyAgent(http_proxy) : false;

const proxy = httpProxy.createProxyServer({
  // tslint:disable-next-line:max-line-length
  target: `https://${config.gateway1Host}:${config.gateway1Port}/${config.gateway1UrlPrefix}/${config.gateway2UrlPrefix}`,
  secure: config.secure,
  toProxy: true,
});

// @ts-ignore
proxy.once('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
  proxyHandler(proxyReq, req, config);
});
// @ts-ignore
proxy.once('proxyRes', (proxyRes: http.IncomingMessage) => {
  if(config.debug){
    console.log(get(proxyRes, 'req._header'));
    console.log(get(proxyRes, 'req.headers'));
  }
});

proxy.on('error', (err, req: http.IncomingMessage) => {
  console.log(err);
  console.log(req);
});

const app = connect();
app.use(bodyParser.json({limit: config.body_limit_size}));
app.use(bodyParser.urlencoded({extended: true, limit: config.body_limit_size}));
app.use((req, res) => console.log("aaa") || proxy.web(req, res, {
  changeOrigin: true,
  agent: httpProxyAgent,
}));

export const server = http.createServer(app);

printConfig();
server.listen(config.localPort);
