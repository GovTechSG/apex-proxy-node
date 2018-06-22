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
// Populate environment variable from dotenv file if applicable
try {
    dotenv_1.config({ path: path_1.default.join(__dirname, '../.env') });
}
catch (ex) {
    console.log('Unable to load dotenv', ex);
}
const config = config_1.getConfig();
const proxy = http_proxy_1.default.createProxyServer({
    target: {
        protocol: 'https:',
        host: config.host,
        port: config.port,
    }
});
proxy.on('proxyReq', (proxyReq, req, res) => {
    handler_1.proxyHandler(proxyReq, req, config);
});
const server = http_1.default.createServer((req, res) => {
    proxy.web(req, res, {
        changeOrigin: true,
    });
});
config_1.printConfig();
server.listen(config.localPort);
//# sourceMappingURL=server.js.map