FROM govtechsg/apex-proxy-node:0.37.51

EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
