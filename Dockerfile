FROM govtechsg/node:node10-production-latest
LABEL maintainer="ryanoolala" \
      description="Image of apex-proxy-node, does authentication header for use with APEX"
WORKDIR /app
COPY . /app
RUN apk add --no-cache bash git \
  && npm install --production

EXPOSE 1337
ENTRYPOINT ["npm", "start"]
