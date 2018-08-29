FROM govtechsg/apex-proxy-node:0.26.0

EXPOSE 1337
ENTRYPOINT ["yarn", "serve"]
