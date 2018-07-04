import {default as express} from 'express';
import path from 'path';
import https from 'https';
import bodyParser from 'body-parser';
import fs from 'fs';

const privateKey  = fs.readFileSync(path.join(__dirname, './fixtures/server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, './fixtures/server.crt'), 'utf8');
const credentials = {key: privateKey, cert: certificate};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const reflectRequest = (req, res) => {
  const {
    url,
    body,
    headers,
    method,
  } = req;

  res.json({
    url,
    body,
    headers,
    method,
  });
}

app.get('*', function (req, res) {
  reflectRequest(req, res);
});

app.post('*', function (req, res) {
  reflectRequest(req, res);
});

app.put('*', function (req, res) {
  reflectRequest(req, res);
});

app.delete('*', function (req, res) {
  reflectRequest(req, res);
});

app.options('*', function (req, res) {
  reflectRequest(req, res);
});

//export const server = app.listen('1336');

export const server = https.createServer(credentials, app);

server.listen(1336);