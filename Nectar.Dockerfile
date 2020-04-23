FROM govtechsg/apex-proxy-node:0.37.42

EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
