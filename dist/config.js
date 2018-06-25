"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
exports.getConfig = () => {
    const { AUTH_MODE, LOCAL_PORT, TARGET_HOST, TARGET_PORT, APP_ID, L1_INTERNAL, L1_SECRET, L2_INTERNAL, L2_KEY_FILE, L2_KEY_STRING, DEBUG, } = process.env;
    return {
        debug: DEBUG,
        mode: AUTH_MODE || constants_1.DEFAULT_MODE,
        localPort: LOCAL_PORT,
        host: TARGET_HOST,
        port: TARGET_PORT,
        appId: APP_ID,
        l1internal: utils_1.isTruthy(L1_INTERNAL),
        secret: L1_SECRET ? L1_SECRET : undefined,
        l2internal: utils_1.isTruthy(L2_INTERNAL),
        keyFile: L2_KEY_FILE ? path_1.default.join(__dirname, '..', L2_KEY_FILE) : undefined,
        keyString: L2_KEY_STRING ? L2_KEY_STRING : undefined,
    };
};
exports.printConfig = () => {
    const config = exports.getConfig();
    console.log(`Auth Mode: ${config.mode}`);
    console.log(`L1 Auth Enabled: ${!!config.secret}`);
    console.log(`L2 Auth Enabled: ${!!(config.keyFile || config.keyString)}`);
    console.log(`Target: ${config.host}:${config.port}`);
    console.log(`Server listening on port ${config.localPort}`);
};
exports.default = exports.getConfig;
//# sourceMappingURL=config.js.map