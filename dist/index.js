"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const proxy = http_proxy_1.default.createProxyServer();
proxy.on('proxyReq', (proxyReq, req, res, opts) => {
    console.log("PR", proxyReq);
    console.log("req", req);
    console.log("res", res);
    console.log("opts", opts);
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});
const server = http_1.default.createServer((req, res) => {
    proxy.web(req, res, {
        target: ''
    });
});
console.log('Listening on port 6666');
server.listen(6666);
//# sourceMappingURL=index.js.map