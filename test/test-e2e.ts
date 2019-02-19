import {expect} from 'chai';
import http from 'http';
import {gzip} from 'node-gzip';
import request from 'request';

const TARGET_SERVER_HOST = 'localhost';
const TARGET_SERVER_PORT = '1336';

const PROXY_SERVER_HOST = 'localhost';
const PROXY_SERVER_PORT = '1337';
// tslint:disable-next-line no-http-string - no need to implement ssl for a test system
const PROXY_SERVER = `http://${PROXY_SERVER_HOST}:${PROXY_SERVER_PORT}`;

const PREFIX_INTERNAL = 'prefix-internal';
const PREFIX_EXTERNAL = 'prefix-external';

const asyncRequest = async (uri, opt): Promise<any> => {
  return new Promise((resolve, reject) => {
    request(uri, opt, (err, _res, body,) => {
      if(err){
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
};

describe('test', () => {
  let proxyServer: http.Server;
  let targetServer: http.Server;

  before(() => {
    // Allow self-signed certificates for request
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    process.env.DEBUG = 'false';
    process.env.SECURE = 'false';
    process.env.AUTH_MODE = 'APPEND';
    process.env.LOCAL_PORT = PROXY_SERVER_PORT;

    process.env.GATEWAY_1_HOST = TARGET_SERVER_HOST;
    process.env.GATEWAY_1_PORT = TARGET_SERVER_PORT;
    process.env.GATEWAY_1_TYPE = 'INTERNAL';
    process.env.GATEWAY_1_URL_PREFIX = PREFIX_INTERNAL;
    process.env.GATEWAY_1_APP_ID = 'app-id-1';
    process.env.GATEWAY_1_SECRET = 'app-secret-1';

    process.env.GATEWAY_2_HOST = 'localhost';
    process.env.GATEWAY_2_PORT = '1335';
    process.env.GATEWAY_2_TYPE = 'EXTERNAL';
    process.env.GATEWAY_2_URL_PREFIX = PREFIX_EXTERNAL;
    process.env.GATEWAY_2_APP_ID = 'app-id-2';
    process.env.GATEWAY_2_SECRET = 'app-secret-2';

    targetServer = require('./reflectionServer').server;
    proxyServer = require('../src/server').server;
  });

  after(()=>{
    proxyServer.close();
    targetServer.close();
  });

  describe('GET', () => {
    it('works for GET requests', async () => {
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const options = {
        method: 'GET',
        json: true,
      };

      const {url, method} = await asyncRequest(uri, options);

      expect(method).to.be.eq('GET');
      expect(url).to.be.eq(`/${PREFIX_INTERNAL}/${PREFIX_EXTERNAL}/some/internal/path`);
    });
  });

  describe('POST', () => {
    it('works for POST requests', async () => {
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const options = {
        method: 'POST',
        json: true,
      };

      const {url, method} = await asyncRequest(uri, options);

      expect(method).to.be.eq('POST');
      expect(url).to.be.eq(`/${PREFIX_INTERNAL}/${PREFIX_EXTERNAL}/some/internal/path`);
    });

    it('works for POST requests with "application/json" typed data', async () => {
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const exampleData = {a: 'fff'};
      const options = {
        method: 'POST',
        body: JSON.stringify(exampleData),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await asyncRequest(uri, options);
      const responseBody = JSON.parse(response);
      expect(responseBody.method).to.be.eq('POST');
      expect(responseBody.url).to.be.eq(`/${PREFIX_INTERNAL}/${PREFIX_EXTERNAL}/some/internal/path`);
      expect(responseBody.body).to.deep.equal(exampleData);
    });

    it('works for POST requests with g-zipped "application/json" typed data', async () => {
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const exampleData = {a: 'fff'};
      const exampleBody = await gzip(JSON.stringify(exampleData), {level: 1});
      const options = {
        method: 'POST',
        body: exampleBody,
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
        }
      };
      const response = await asyncRequest(uri, options);
      const responseBody = JSON.parse(response);
      expect(responseBody.statusCode).to.not.equal(400);
      expect(responseBody.method).to.be.eq('POST');
      expect(responseBody.url).to.be.eq(`/${PREFIX_INTERNAL}/${PREFIX_EXTERNAL}/some/internal/path`);
    });
  });

  describe('PUT', () => {
    it('works for PUT requests', async () => {
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const options = {
        method: 'PUT',
        json: true,
      };

      const {url, method} = await asyncRequest(uri, options);

      expect(method).to.be.eq('PUT');
      expect(url).to.be.eq(`/${PREFIX_INTERNAL}/${PREFIX_EXTERNAL}/some/internal/path`);
    });
  });

  describe('DELETE', () => {
    it('works for DELETE requests', async () => {
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const options = {
        method: 'DELETE',
        json: true,
      };

      const {url, method} = await asyncRequest(uri, options);

      expect(method).to.be.eq('DELETE');
      expect(url).to.be.eq(`/${PREFIX_INTERNAL}/${PREFIX_EXTERNAL}/some/internal/path`);
    });
  });

  describe('OPTIONS', () => {
    it('works for OPTIONS requests', async () => {
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const options = {
        method: 'OPTIONS',
        json: true,
      };

      const {url, method} = await asyncRequest(uri, options);

      expect(method).to.be.eq('OPTIONS');
      expect(url).to.be.eq(`/${PREFIX_INTERNAL}/${PREFIX_EXTERNAL}/some/internal/path`);
    });
  });

  describe('Generic', () => {
    it('appends authorization headers in APPEND mode', async () => {
      const customAuthorizationHeader = 'meh meh';
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const options = {
        method: 'POST',
        json: true,
        headers: {
          authorization: customAuthorizationHeader,
        }
      };

      const {headers} = await asyncRequest(uri, options);

      // TODO: Add verification that authorization is signed correctly
      expect(headers.authorization).to.not.be.empty;
      expect(headers.authorization).to.contain(customAuthorizationHeader);
    });

    it('adds in authorization headers', async () => {
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const options = {
        method: 'POST',
        json: true,
      };

      const {headers} = await asyncRequest(uri, options);

      // TODO: Add verification that authorization is signed correctly
      expect(headers.authorization).to.not.be.empty;
    });

    it('forwards the body of the request', async () => {
      const data = {
        string: 'A String',
        number: 12,
        array: [1, 2, 'three'],
        object: {
          string: 'A String',
          number: 12,
          array: [1, 2, 'three'],
        }
      };
      const uri = `${PROXY_SERVER}/some/internal/path`;
      const options = {
        method: 'POST',
        json: data,
      };

      const {body} = await asyncRequest(uri, options);

      expect(body).to.be.deep.eq(data);
    });
  });
});
