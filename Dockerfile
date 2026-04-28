FROM node:24-bookworm-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .
RUN mkdir -p public/uploads

FROM node:24-bookworm-slim
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update \
  && apt-get upgrade -y \
  && rm -rf /usr/local/lib/node_modules/npm \
            /opt/yarn-v* \
            /usr/local/bin/npm \
            /usr/local/bin/npx \
            /usr/local/bin/yarn \
            /usr/local/bin/yarnpkg \
            /usr/local/bin/corepack \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app /usr/src/app
RUN chown -R node:node /usr/src/app

USER node
EXPOSE 3000
CMD ["node", "main.js"]
