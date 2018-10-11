import bodyParser from 'body-parser';
import HttpsProxyAgent from 'https-proxy-agent';
import connect from 'connect';
import compression from 'compression';
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
const httpProxyValue = config.customHttpProxy || config.httpProxy;
const httpProxyAgent = httpProxyValue ? new HttpsProxyAgent(httpProxyValue) : false;
const proxyWithAgentOptions = { toProxy: config.toProxy, agent: httpProxyAgent};
const proxyOptions = Object.assign({
  // tslint:disable-next-line:max-line-length
  target: `https://${config.gateway1Host}:${config.gateway1Port}/${config.gateway1UrlPrefix}/${config.gateway2UrlPrefix}`,
  secure: config.secure,
}, config.useProxyAgent && proxyWithAgentOptions);

console.log({proxyOptions})
const proxy = httpProxy.createProxyServer(proxyOptions);

proxy.on('proxyReq', (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
  proxyHandler(proxyReq, req, config);
});

proxy.on('proxyRes', (proxyRes: http.IncomingMessage) => {
  if(config.debug){
    console.log(get(proxyRes, 'req._header'));
    console.log(get(proxyRes, 'headers'));
  }
});

proxy.on('error', (err, req: http.IncomingMessage) => {
  console.log(err);
  console.log(req);
});

const app = connect();
app.use(compression({filter: () => { return true; }}));
app.use(bodyParser.json({limit: config.bodyLimitSize}));
app.use(bodyParser.urlencoded({extended: true, limit: config.bodyLimitSize}));
app.use((req, res) => proxy.web(req, res, {
  changeOrigin: true,
}));

export const server = http.createServer(app);

printConfig();
server.listen(config.localPort);
