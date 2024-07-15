FROM oven/bun:1-alpine AS build
WORKDIR /usr/src/app

RUN apk add --no-cache python3
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run db:generate
RUN bun run db:migrate
RUN bun run build

FROM oven/bun:1-alpine AS deploy
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist /usr/src/app

EXPOSE 5000/tcp
ENTRYPOINT [ "bun", "run", "server.js" ]
