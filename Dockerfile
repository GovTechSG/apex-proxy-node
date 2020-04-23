FROM node:10.20.1-alpine3.11  AS builder
WORKDIR /app
COPY . /app
RUN yarn global add typescript && \
  yarn install && \
  yarn compile && \
  rm -rf node_modules && \
  yarn install --production

FROM 10.20.1-alpine3.11 AS production
LABEL maintainer="ryanoolala" \
  description="Image of apex-proxy-node, does authentication header for use with APEX"
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
