FROM govtechsg/apex-proxy-node:0.37.33

EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
