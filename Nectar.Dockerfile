FROM govtechsg/apex-proxy-node:0.37.50

EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
