import bodyParser from 'body-parser';
import {default as express} from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';

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
};

app.get('*', (req, res) => {
  reflectRequest(req, res);
});

app.post('*', (req, res) => {
  reflectRequest(req, res);
});

app.put('*', (req, res) => {
  reflectRequest(req, res);
});

app.delete('*', (req, res) => {
  reflectRequest(req, res);
});

app.options('*', (req, res) => {
  reflectRequest(req, res);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500);
  res.json(err);
});

// export const server = app.listen('1336');

export const server = https.createServer(credentials, app);

server.listen(1336);