FROM freeyeti/dev-in-docker:node-16-yarn-2 AS builder

RUN mkdir /test-backend
WORKDIR /test-backend
COPY . .

RUN yarn --frozen-lockfile
RUN yarn build

# remove development dependencies
RUN npm prune --production

FROM node:16-alpine

RUN mkdir /app
WORKDIR /app

COPY --from=builder /test-backend/dist ./dist
COPY --from=builder /test-backend/node_modules ./node_modules
COPY --from=builder /test-backend/package.json ./package.json
COPY --from=builder /test-backend/scripts ./scripts
COPY --from=builder /test-backend/docker-entrypoint-staging.sh ./docker-entrypoint-staging.sh

EXPOSE 3000
CMD ["./docker-entrypoint-staging.sh"]