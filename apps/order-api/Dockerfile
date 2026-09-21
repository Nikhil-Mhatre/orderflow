# syntax=docker/dockerfile:1

# =============================================================================
# Build stage
# =============================================================================

FROM node:24-bookworm-slim AS builder

RUN corepack enable

WORKDIR /workspace

# Root workspace configuration required by pnpm and TypeScript.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Workspace package manifests required by order-api.
COPY apps/order-api/package.json apps/order-api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

# Install the complete workspace dependency graph.
RUN pnpm install --frozen-lockfile

# Copy application source and required workspace packages.
COPY apps/order-api apps/order-api
COPY packages/contracts packages/contracts
COPY packages/eslint-config packages/eslint-config
COPY packages/typescript-config packages/typescript-config

# Build the Order API.
RUN pnpm --filter @orderflow/order-api build

# Generate a self-contained production dependency tree.
RUN pnpm deploy \
    --filter @orderflow/order-api \
    --prod \
    /tmp/order-api


# =============================================================================
# Production runtime
# =============================================================================
#
# Distroless intentionally contains no shell, package manager, or standard
# Linux command-line utilities.
#
# The "nonroot" variant runs the application without root privileges.
#
# This is intentionally a completely different runtime environment from the
# development image.
FROM gcr.io/distroless/nodejs24-debian13:nonroot AS production

WORKDIR /app

# Copy only production dependencies.
COPY --from=builder --chown=nonroot:nonroot \
    /tmp/order-api/node_modules \
    ./node_modules

# Copy runtime package metadata.
COPY --from=builder --chown=nonroot:nonroot \
    /tmp/order-api/package.json \
    ./package.json

# Copy only compiled application code.
COPY --from=builder --chown=nonroot:nonroot \
    /workspace/apps/order-api/dist \
    ./dist

EXPOSE 3001

CMD ["dist/server.js"]
