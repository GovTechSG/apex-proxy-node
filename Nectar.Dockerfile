FROM govtechsg/apex-proxy-node:0.37.11

EXPOSE 1337
ENTRYPOINT ["yarn", "serve"]
