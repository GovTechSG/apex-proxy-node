"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const lodash_1 = require("lodash");
const node_apex_api_security_1 = require("node-apex-api-security");
exports.l1Signature = (req, config) => {
    const { method, url } = req;
    const { appId, secret, l1internal } = config;
    const authPrefix = l1internal ? constants_1.AUTH_PREFIX.L1.INTERNAL : constants_1.AUTH_PREFIX.L1.EXTERNAL;
    if (!secret || !appId)
        return;
    const opts = {
        appId,
        secret,
        authPrefix,
        httpMethod: method,
        urlPath: url,
    };
    return node_apex_api_security_1.ApiSigningUtil.getSignatureToken(opts);
};
exports.l2Signature = (req, config) => {
    const { method, url } = req;
    const { appId, keyString, keyFile, l2internal } = config;
    const authPrefix = l2internal ? constants_1.AUTH_PREFIX.L2.INTERNAL : constants_1.AUTH_PREFIX.L2.EXTERNAL;
    if (!(keyString || keyFile) || !appId)
        return;
    const opts = {
        appId,
        keyString,
        keyFile,
        authPrefix,
        httpMethod: method,
        urlPath: url,
    };
    return node_apex_api_security_1.ApiSigningUtil.getSignatureToken(opts);
};
exports.proxyHandler = (proxyReq, req, config) => {
    const signatureL1 = exports.l1Signature(req, config);
    const signatureL2 = exports.l2Signature(req, config);
    const signature = (signatureL1 && signatureL2) ? `${signatureL1}, ${signatureL2}` : signatureL1 || signatureL2;
    if (signature && config.mode === constants_1.MODE.REWRITE) {
        proxyReq.setHeader('Authorization', signature);
    }
    else if (signature && config.mode === constants_1.MODE.APPEND) {
        const authorization = lodash_1.get(req, 'headers.authorization');
        proxyReq.setHeader('Authorization', authorization ? `${signature}, ${authorization}` : signature);
    }
};
//# sourceMappingURL=handler.js.map