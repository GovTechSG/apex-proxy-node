# Apex Proxy Node

[![Build Status](https://travis-ci.org/GovTechSG/apex-proxy-node.svg?branch=master)](https://travis-ci.org/GovTechSG/apex-proxy-node)

Proxy with implementation of [node-apex-api-security](https://github.com/GovTechSG/node-apex-api-security) for authentication headers to be added to requests that are proxied through it.

# Building

``` bash

> npm install -g typescript
> tsc --project ./tsconfig-prod.json
> docker-compose up

```

# Pre-requisites

1. You have configured your APEX gateways
  - gateway URLs ("GATEWAY_x_HOST")
  - api endpoints ("GATEWAY_x_URL_PREFIX")
2. You have added your L1 and L2 policies with application approved to use the API
  - L1, secrets and app id generated in APEX console
  - L2, signed cert, private keys and app id generated in APEX console

# Usage

To try it out, first build the application with the above build steps, assuming you have an internet(EXTERNAL) gateway in APEX, update the environment variables in docker-compose.yml

> docker-compose up

# Configuration

| Name | Description | Type | Default | Required |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------|------------------|------------------------------------------------------|------------------|
| DEBUG | Prints out Authorization header signature that is appended into the final request header | boolean | false | No |
| Secure | If true, check HTTPS certificate for authenticity. *warning* Only turn off if you cannot verify certificates. | boolean | true | No |
| BODY_LIMIT_SIZE | Increase if you face bodyparser size issues, usually only if you are sending files through the proxy | string | 4200kb | No |
| AUTH_MODE | Determines if the generated Authorization value is appended or rewritten to the header.  Values accepted (APPEND, REWRITE)   | string | APPEND | No |
| LOCAL_PORT | Port at which your proxy will listen for incoming requests | integer(0-65535) | - | Yes |
| HTTP_PROXY | Sets the endpoint to the proxy that will your requests will be forwarded to | string | As configured in your environment HTTP_PROXY env var | No |
| CUSTOM_HTTP_PROXY | Used when you have a default HTTP_PROXY, and you wish to change it to use a separate proxy | string | - | No |
| USE_PROXY_AGENT | Determines if requests are forwarded to a proxy first, before sent to the APEX endpoint | boolean | false | No |
| TO_PROXY | Set this to true if USE_PROXY_AGENT is true | boolean | false | No |
| GATEWAY_1_HOST | URL(e.g <yourproject>.api.xxx.sg of the first target endpoint your request will be sent | string | - | Yes |
| GATEWAY_1_SIGNING_HOST | URL(e.g <yourproject>.e.api.xxx.sg) note that .e or .i is required in the signing as APEX does signing with .e and .i depending on which gateway you are hitting of the first target endpoint that is used to generate the signature | string | - | Yes |
| GATEWAY_1_TYPE | Values accepted (INTERNAL, EXTERNAL) | string | - | Yes |
| GATEWAY_1_URL_PREFIX | Path of the URL which is determined in the APEX console(e.g. live12345) | string | - | Yes |
| GATEWAY_1_APP_ID | App ID which you created in APEX console | string | - | Yes |
| GATEWAY_1_SECRET | App secret password, used in L1 policies only | string | - | Yes (L1) No (L2) |
| GATEWAY_1_KEY_FILE | Linux Absolute Path to the private key file used in L2 policies only | string | - | No (L1) Yes (L2) |
| GATEWAY_1_KEY_STRING | Private key string, *warning* Use GATEWAY_1_KEY_FILE preferably instead of this | string | - | No (L1) Yes (L2) |
| GATEWAY_1_PASSPHRASE | Passphrase for the private key | string | - | No (L1) Yes (L2) |
| GATEWAY_2_HOST | URL of the second target endpoint your request will be sent | string | - | Yes |
| GATEWAY_2_SIGNING_HOST | URL of the second target endpoint that is used to generate the signature | string | - | Yes |
| GATEWAY_2_TYPE | Values accepted (INTERNAL, EXTERNAL) | string | - | Yes |
| GATEWAY_2_URL_PREFIX | Path of the URL which is determined in the APEX console(e.g. live12345) | string | - | Yes |
| GATEWAY_2_APP_ID | App ID which you created in APEX console | string | - | Yes |
| GATEWAY_2_SECRET | App secret password, used in L1 policies only | string | - | Yes (L1) No (L2) |
| GATEWAY_2_KEY_FILE | Linux Absolute Path to the private key file used in L2 policies only | string | - | No (L1) Yes (L2) |
| GATEWAY_2_KEY_STRING | Private key string, *warning* Use GATEWAY_2_KEY_FILE preferably instead of this | string | - | No (L1) Yes (L2) |
| GATEWAY_2_PASSPHRASE | Passphrase for the private key | string | - | No (L1) Yes (L2) |

# Development

> cp .env-example .env

Modify .env file with your configuration variables

> yarn dev

# Deployment

Deploy in Nectar by building with Nectar.Dockerfile

# LICENSE
[MIT LICENSE](https://github.com/GovTechSG/apex-proxy-node/blob/master/LICENSE)
