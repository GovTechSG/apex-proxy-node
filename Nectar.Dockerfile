FROM govtechsg/apex-proxy-node:0.37.19

EXPOSE 1337
ENTRYPOINT ["npm", "start"]
