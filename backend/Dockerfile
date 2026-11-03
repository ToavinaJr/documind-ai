FROM oven/bun:1.3.14-alpine AS dependencies

WORKDIR /app
COPY backend/package.json backend/bun.lock ./
RUN bun install --frozen-lockfile

FROM dependencies AS build

COPY backend/ ./
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build bun run prisma:generate
RUN bun run build

FROM oven/bun:1.3.14-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=bun:bun /app/package.json /app/bun.lock ./
RUN bun install --production --frozen-lockfile
COPY --from=build --chown=bun:bun /app/dist ./dist

USER bun
EXPOSE 3001

CMD ["bun", "run", "start"]
