FROM govtechsg/apex-proxy-node:0.37.0

EXPOSE 1337
ENTRYPOINT ["yarn", "serve"]
