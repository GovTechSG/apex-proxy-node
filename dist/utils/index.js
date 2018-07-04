"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
exports.generateSHA512Hash = (data) => crypto_1.createHash('sha512').update(data || '').digest('hex');
exports.isTruthy = (value) => {
    const valueType = typeof value;
    switch (valueType) {
        case 'string':
            const normalisedValue = value.toLowerCase();
            return (normalisedValue === 'true'
                || normalisedValue === '1');
        case 'number':
            return value >= 1;
        case 'boolean':
            return value;
        default:
            return false;
    }
};
exports.printOpts = (opts) => {
    opts.secret = exports.generateSHA512Hash(opts.secret);
    opts.passphrase = exports.generateSHA512Hash(opts.passphrase);
    opts.keyString = exports.generateSHA512Hash(opts.keyString);
    console.log("Signing opts:", opts);
};
//# sourceMappingURL=index.js.map