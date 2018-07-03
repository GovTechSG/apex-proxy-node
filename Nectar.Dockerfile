FROM govtechsg/apex-proxy-node:0.12.0

EXPOSE 1337
ENTRYPOINT ["yarn", "serve"]
