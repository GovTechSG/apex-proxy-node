import http from 'http';
import request from 'request';
import {expect, assert} from 'chai';

const TARGET_SERVER_HOST = 'localhost';
const TARGET_SERVER_PORT = '1336';
const TARGET_SERVER = `https://${TARGET_SERVER_HOST}:${TARGET_SERVER_PORT}`;

describe('test', () => {
  let proxyServer: http.Server;
  let targetServer: http.Server;

  before(() => {
    // Allow self-signed certificates for request
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    process.env.DEBUG = 'true';
    process.env.SECURE = 'false';
    process.env.AUTH_MODE = 'APPEND';
    process.env.LOCAL_PORT = '1337';

    process.env.GATEWAY_1_HOST = 'localhost';
    process.env.GATEWAY_1_PORT = '1336';
    process.env.GATEWAY_1_TYPE = 'INTERNAL';
    process.env.GATEWAY_1_URL_PREFIX = 'prefix-internal';
    process.env.GATEWAY_1_APP_ID = 'app-id-1';
    process.env.GATEWAY_1_SECRET = 'app-secret-1';

    process.env.GATEWAY_2_HOST = 'localhost';
    process.env.GATEWAY_2_PORT = '1335';
    process.env.GATEWAY_2_TYPE = 'EXTERNAL';
    process.env.GATEWAY_2_URL_PREFIX = 'prefix-external';
    process.env.GATEWAY_2_APP_ID = 'app-id-2';
    process.env.GATEWAY_2_SECRET = 'app-secret-2';

    targetServer = require('./reflectionServer').server;
    proxyServer = require('../src/server').server;
  });

  after(()=>{
    proxyServer.close();
    targetServer.close();
  })

  it('works', () => {
    expect(1).to.be.eq(1);
  });

  it('test2', (done)=>{
    const options = {
      uri: `${TARGET_SERVER}/test123`,
      method: 'POST',
      json: {
        "longUrl": "http://www.google.com/"
      }
    };

    request.post(options, (err, res, body) => {
      console.log("Response:", body);
      done();
    });
    /*spo
    http.get('http://localhost:1336/test123', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });*/
  });
});