FROM govtechsg/base-images:node8-8.12.0
LABEL maintainer="ryanoolala" \
      description="Image of apex-proxy-node, does authentication header for use with APEX"
WORKDIR /app
COPY . /app
RUN apk add --no-cache bash git yarn \
  && yarn install --production=true

EXPOSE 1337
ENTRYPOINT ["yarn", "serve"]
