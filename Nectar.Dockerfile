FROM govtechsg/apex-proxy-node:0.37.56

EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
