FROM govtechsg/apex-proxy-node:0.37.40

EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
