# Order API

Order API is the HTTP microservice responsible for creating and retrieving orders in OrderFlow.

The service is independently executable, testable, buildable, and deployable within the monorepo.

## Responsibilities

The Order API is responsible for:

- Exposing the HTTP API for orders.
- Validating incoming requests.
- Creating and retrieving orders.
- Persisting order data in PostgreSQL.
- Publishing `OrderCreated` events to AWS EventBridge.
- Exposing health and readiness endpoints.
- Providing structured application logging.
- Managing its own runtime configuration.

The service does not consume SQS messages. SQS consumption belongs to `order-worker`.

## Architecture

The development and production integration path is intentionally the same:

```text
Client
  │
  ▼
Order API
  │
  ├──────────────► PostgreSQL
  │
  │ OrderCreated
  ▼
EventBridge
  │
  │ EventBridge Rule
  ▼
SQS
  │
  ▼
Order Worker
```

The API publishes events to EventBridge. EventBridge is responsible for routing those events to the appropriate SQS queue.

The API does not publish directly to SQS.

## Technology

The service currently uses:

- Node.js
- TypeScript
- Express
- PostgreSQL
- Drizzle ORM
- AWS EventBridge
- Zod
- Pino
- Vitest

Shared TypeScript and ESLint configuration is provided by:

```text
@orderflow/typescript-config
@orderflow/eslint-config
```

## Project structure

The intended service structure is:

```text
apps/order-api/
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── drizzle.config.ts
├── .env.example
├── .dockerignore
├── .gitignore
├── Dockerfile
├── README.md
│
├── src/
│   ├── config/
│   ├── db/
│   ├── events/
│   ├── health/
│   ├── middleware/
│   ├── modules/
│   │   └── orders/
│   ├── app.ts
│   └── server.ts
│
└── tests/
```

The exact `src` structure should follow the existing business code rather than forcing unnecessary rewrites.

## Environment configuration

Create a local environment file from the example:

```bash
cp .env.example .env
```

Required configuration includes:

```text
NODE_ENV
PORT
DATABASE_URL
AWS_REGION
EVENT_BUS_NAME
```

Real credentials must not be stored in `.env.example` or committed to Git.

For local AWS access, use the AWS credential chain/profile provided by the AWS CLI.

## Development

From the repository root:

```bash
pnpm --filter @orderflow/order-api dev
```

Or from this directory:

```bash
pnpm dev
```

The development server runs with `tsx` and watches the source tree for changes.

## Type checking

```bash
pnpm typecheck
```

This runs TypeScript without emitting build output.

## Linting

```bash
pnpm lint
```

The service consumes the shared Node.js ESLint configuration from:

```text
@orderflow/eslint-config/node
```

Service-specific linting rules should only be added when they are genuinely specific to the Order API.

## Testing

Run the test suite:

```bash
pnpm test
```

Run Vitest in watch mode:

```bash
pnpm test:watch
```

## Build

Create the production JavaScript output:

```bash
pnpm build
```

Compiled files are emitted to:

```text
dist/
```

Start the compiled application:

```bash
pnpm start
```

## Database

The Order API owns its PostgreSQL schema and Drizzle migrations.

Generate migrations:

```bash
pnpm db:generate
```

Apply migrations:

```bash
pnpm db:migrate
```

The database connection is provided through:

```text
DATABASE_URL
```

The Drizzle configuration is defined in:

```text
drizzle.config.ts
```

## AWS EventBridge

The API publishes `OrderCreated` events to the configured EventBridge bus.

The application should use the AWS SDK directly against AWS EventBridge in development and production.

Development does not replace EventBridge with an in-process mock or local event bus.

The infrastructure configuration determines which EventBridge bus is used:

```text
Development → orderflow-dev
Production  → production EventBridge bus
```

The application code remains unchanged between environments.

## Service independence

The Order API owns its application dependencies and runtime configuration.

It should not depend on:

- `order-worker` source code.
- Worker-specific configuration.
- SQS consumer implementation.
- Worker runtime dependencies.
- Root-level application code.

Shared packages should only be introduced when there is a concrete cross-service requirement.

## Commands

| Command            | Purpose                          |
| ------------------ | -------------------------------- |
| `pnpm dev`         | Run the API in development mode  |
| `pnpm build`       | Compile the API                  |
| `pnpm start`       | Run the compiled API             |
| `pnpm lint`        | Run ESLint                       |
| `pnpm typecheck`   | Run TypeScript type checking     |
| `pnpm test`        | Run tests                        |
| `pnpm test:watch`  | Run tests in watch mode          |
| `pnpm db:generate` | Generate Drizzle migrations      |
| `pnpm db:migrate`  | Apply database migrations        |
| `pnpm clean`       | Remove generated build artifacts |

## Deployment

The service is intended to be packaged as an independent container image.

The production deployment flow is:

```text
Source
  │
  ▼
CI
  │
  ▼
Docker image
  │
  ▼
Amazon ECR
  │
  ▼
Kubernetes
  │
  ▼
Order API Deployment
```

Infrastructure and deployment configuration are maintained outside this application package.

The application itself should remain focused on its business and service responsibilities.
