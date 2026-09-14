# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable


FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile


FROM dependencies AS builder

COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY src ./src

RUN pnpm run typecheck
RUN pnpm run build


FROM base AS production-dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod


FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs orderflow

COPY --from=production-dependencies \
  --chown=orderflow:nodejs \
  /app/node_modules ./node_modules

COPY --from=builder \
  --chown=orderflow:nodejs \
  /app/dist ./dist

COPY --chown=orderflow:nodejs \
  package.json ./

USER orderflow

EXPOSE 3000

CMD ["node", "dist/server.js"]
