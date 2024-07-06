FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

RUN apk add --no-cache python3
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .

EXPOSE 5000/tcp
ENTRYPOINT [ "bun", "run", "src/server.ts" ]
