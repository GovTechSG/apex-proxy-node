FROM govtechsg/apex-proxy-node:0.37.49

EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
