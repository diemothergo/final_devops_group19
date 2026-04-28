FROM node:22-bookworm-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .
RUN mkdir -p public/uploads

FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder --chown=65532:65532 /usr/src/app /usr/src/app

EXPOSE 3000
CMD ["main.js"]
