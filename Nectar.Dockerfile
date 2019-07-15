FROM govtechsg/apex-proxy-node:0.37.29

EXPOSE 1337
ENTRYPOINT ["npm", "start"]
