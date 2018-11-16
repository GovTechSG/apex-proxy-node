import { createHash } from "crypto";
import { join } from 'path';
import { parse, resolve } from 'url';

export const generateSHA512Hash = (data: string): string =>
  createHash('sha512').update(data || '').digest('hex');

export const isTruthy = (value: any): boolean => {
  const valueType = typeof value;
  switch(valueType) {
    case 'string':
      const normalisedValue = value.toLowerCase();
      return (
        normalisedValue === 'true'
        || normalisedValue === '1'
      );
    case 'number':
      return value >= 1;
    case 'boolean':
      return value;
    default:
      return false;
  }
};

export const printOpts = (opts: any): void =>{
  const tempOpts = {...opts};
  tempOpts.secret = generateSHA512Hash(opts.secret);
  tempOpts.passphrase = generateSHA512Hash(opts.passphrase);
  tempOpts.keyString = generateSHA512Hash(opts.keyString);
  console.log("Printing opts:", tempOpts);
};

export const resolveUrl = (urlStub: string, ...urlPathToAdd: string[]): string => {
  const urlStubObject = parse(urlStub);
  const {protocol, hostname, port} = urlStubObject;
  switch (protocol) {
    case 'http:': // tslint:disable-line no-http-string
    case 'https:':
    case 'ftp:':
      break;
    default:
      throw new Error('Protocol was not specified. Prefix :urlStub with "http://" or "https://"');
  }
  const hostStub = `${protocol}//${hostname}${port ? `:${port}` : ''}/`;
  const urlStubPath = urlStubObject.pathname || '/';
  return resolve(hostStub, join(urlStubPath, ...urlPathToAdd));
};
