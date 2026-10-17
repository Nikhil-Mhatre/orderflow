
# ---------- Build stage ----------
FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN corepack enable

# Install dependencies using the lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and compile TypeScript
COPY . .
RUN pnpm build

# Keep only production dependencies
RUN pnpm prune --prod


# ---------- Production stage ----------
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Production dependencies and compiled application
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/package.json ./package.json
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist

# AWS RDS CA bundle for verified TLS connections
COPY --chown=nonroot:nonroot certs/global-bundle.pem /app/certs/global-bundle.pem

EXPOSE 3000

# Distroless Node.js images already use Node as their entrypoint.
CMD ["dist/server.js"]
