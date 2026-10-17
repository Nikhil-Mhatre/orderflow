
# ---------- Build stage ----------
FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN corepack enable

# Copy dependency manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy worker source
COPY . .

# Compile TypeScript
RUN pnpm build

# Remove development dependencies
RUN pnpm prune --prod


# ---------- Production stage ----------
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS production

WORKDIR /app

ENV NODE_ENV=production

# Production dependencies
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/package.json ./package.json

# Compiled worker
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist

# AWS RDS CA bundle for verified PostgreSQL TLS
COPY --chown=nonroot:nonroot certs/global-bundle.pem /app/certs/global-bundle.pem

# Distroless Node.js image runs Node directly as non-root
CMD ["dist/index.js"]
