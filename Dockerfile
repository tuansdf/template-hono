FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app

RUN apk add --no-cache python3
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .

USER bun
EXPOSE 5000/tcp
ENTRYPOINT [ "bun", "run", "src/server.ts" ]
