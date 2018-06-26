"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const http_1 = __importDefault(require("http"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const handler_1 = require("./handler");
const lodash_1 = require("lodash");
// Populate environment variable from dotenv file if applicable
try {
    dotenv_1.config({ path: path_1.default.join(__dirname, '../.env') });
}
catch (ex) {
    console.log('Unable to load dotenv', ex);
}
const config = config_1.getConfig();
const proxy = http_proxy_1.default.createProxyServer({
    target: `https://${config.host}:${config.port}/${config.gateway1UrlPrefix}/${config.gateway2UrlPrefix}`,
    secure: config.secure,
});
proxy.on('proxyReq', (proxyReq, req) => {
    handler_1.proxyHandler(proxyReq, req, config);
});
config.debug && proxy.on('proxyRes', (proxyRes) => {
    console.log(lodash_1.get(proxyRes, 'req._header'));
});
proxy.on('error', (err, req) => {
    console.log(err);
    console.log(req);
});
const server = http_1.default.createServer((req, res) => {
    proxy.web(req, res, {
        changeOrigin: true,
    });
});
config_1.printConfig();
server.listen(config.localPort);
//# sourceMappingURL=server.js.map