FROM govtechsg/apex-proxy-node:0.37.22

EXPOSE 1337
ENTRYPOINT ["npm", "start"]
