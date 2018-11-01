export interface IConfig {
  debug: boolean;
  secure: boolean;
  bodyLimitSize? : string;
  localPort: string;

  // REWRITE or APPEND Signature to Authorization header
  mode: string;

  // Target to forward request to
  gateway1Host : string;
  gateway1SigningHost : string;
  gateway1Port : string;
  gateway1Type? : string;
  gateway1UrlPrefix? : string;
  gateway1AppId? : string;
  gateway1Secret? : string;
  gateway1KeyString? : string;
  gateway1KeyFile? : string;
  gateway1Passphrase? : string;

  gateway2Host : string;
  gateway2SigningHost : string;
  gateway2Port : string;
  gateway2Type? : string;
  gateway2UrlPrefix? : string;
  gateway2AppId? : string;
  gateway2Secret? : string;
  gateway2KeyString? : string;
  gateway2KeyFile? : string;
  gateway2Passphrase? : string;

  httpProxy? : string;
  customHttpProxy? : string;
  useProxyAgent? : boolean;
  toProxy? : boolean;
  timeout? : number;
  proxyTimeout? : number;
}
