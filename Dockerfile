FROM govtechsg/base-images:node8-8.9.4
WORKDIR /app
COPY . /app
RUN apk add --no-cache bash git yarn \
  && yarn install --production=true

ENTRYPOINT ["yarn", "serve"]