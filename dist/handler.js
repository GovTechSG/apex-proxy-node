"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const lodash_1 = require("lodash");
const node_apex_api_security_1 = require("node-apex-api-security");
const querystring_1 = __importDefault(require("querystring"));
exports.signature = ({ type, secret, keyFile, keyString, appId, httpMethod, urlPath, }, config) => {
    let authPrefix;
    if (type === 'INTERNAL') {
        if (secret) {
            authPrefix = constants_1.AUTH_PREFIX.L1.INTERNAL;
        }
        else {
            authPrefix = constants_1.AUTH_PREFIX.L2.INTERNAL;
        }
    }
    else {
        if (secret) {
            authPrefix = constants_1.AUTH_PREFIX.L1.EXTERNAL;
        }
        else {
            authPrefix = constants_1.AUTH_PREFIX.L2.EXTERNAL;
        }
    }
    const opts = {
        appId,
        secret,
        keyString,
        keyFile,
        httpMethod,
        authPrefix,
        urlPath,
    };
    config && config.debug && console.log("Signing opts:", opts);
    return node_apex_api_security_1.ApiSigningUtil.getSignatureToken(opts);
};
exports.firstGateSignature = (req, config) => {
    if (!config.gateway1AppId || !(config.gateway1Secret || config.gateway1KeyFile || config.gateway1KeyString))
        return;
    const { method, url } = req;
    const { host, port, gateway1UrlPrefix, gateway2UrlPrefix, gateway1Type, gateway1AppId, gateway1Secret, gateway1KeyString, gateway1KeyFile, } = config;
    const urlPath = `https://${host}:${port}/${gateway1UrlPrefix}/${gateway2UrlPrefix}${url}`;
    return exports.signature({
        type: gateway1Type,
        secret: gateway1Secret,
        keyFile: gateway1KeyFile,
        keyString: gateway1KeyString,
        appId: gateway1AppId,
        httpMethod: method,
        urlPath,
    }, config);
};
exports.secondGateSignature = (req, config) => {
    if (!config.gateway2AppId || !(config.gateway2Secret || config.gateway2KeyFile || config.gateway2KeyString))
        return;
    const { method, url } = req;
    const { host, port, gateway2UrlPrefix, gateway2Type, gateway2AppId, gateway2Secret, gateway2KeyString, gateway2KeyFile, } = config;
    const urlPath = `https://${host}:${port}/${gateway2UrlPrefix}${url}`;
    return exports.signature({
        type: gateway2Type,
        secret: gateway2Secret,
        keyFile: gateway2KeyFile,
        keyString: gateway2KeyString,
        appId: gateway2AppId,
        httpMethod: method,
        urlPath,
    }, config);
};
exports.proxyHandler = (proxyReq, req, config) => {
    proxyReq.setHeader('Host', config.host);
    const gate1Signature = exports.firstGateSignature(req, config);
    const gate2Signature = exports.secondGateSignature(req, config);
    const signature = (gate1Signature && gate2Signature) ? `${gate1Signature}, ${gate2Signature}` : gate1Signature || gate2Signature;
    if (signature && config.mode === constants_1.MODE.REWRITE) {
        proxyReq.setHeader('Authorization', signature);
    }
    else if (signature && config.mode === constants_1.MODE.APPEND) {
        const authorization = lodash_1.get(req, 'headers.authorization');
        proxyReq.setHeader('Authorization', authorization ? `${signature}, ${authorization}` : signature);
    }
    const body = lodash_1.get(req, 'body');
    if (body) {
        const contentType = proxyReq.getHeader('Content-Type');
        let bodyData;
        if (contentType === 'application/json') {
            bodyData = JSON.stringify(body);
        }
        if (contentType === 'application/x-www-form-urlencoded') {
            bodyData = querystring_1.default.stringify(body);
        }
        if (bodyData) {
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    }
};
//# sourceMappingURL=handler.js.map