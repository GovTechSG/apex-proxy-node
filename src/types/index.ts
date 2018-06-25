export interface IConfig {
  debug: boolean;
  localPort: string;
  // REWRITE or APPEND Signature to Authorization header
  mode: string;

  // Target to forward request to
  host: string;
  port: string;

  // App ID in Apex
  appId: string;

  // For L1 Authentication
  l1internal?: boolean;
  secret?: string;

  // For L2 Authentication
  l2internal?: boolean;
  keyString?: string;
  keyFile?: string;
}