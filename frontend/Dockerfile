
# ---------- Build stage ----------
FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN corepack enable

# Copy dependency manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies, including build-time dependencies
RUN pnpm install --frozen-lockfile

# Copy frontend source
COPY . .

# Build Next.js standalone output
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build


# ---------- Production stage ----------
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS production

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone server and traced runtime dependencies
COPY --from=build --chown=nonroot:nonroot /app/.next/standalone ./

# Static assets
COPY --from=build --chown=nonroot:nonroot /app/.next/static ./.next/static

EXPOSE 3000

# Distroless Node.js entry point
CMD ["server.js"]
