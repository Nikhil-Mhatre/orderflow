# @orderflow/eslint-config

Shared ESLint flat configurations for the OrderFlow monorepo.

This package provides reusable ESLint presets for JavaScript and TypeScript projects. Runtime-specific configuration is separated from the shared rules so that backend services can use the Node.js preset without forcing Node.js assumptions onto other applications.

## Available presets

### `base`

The base preset provides the common linting rules used across the repository.

It includes:

- ESLint recommended rules.
- TypeScript-aware linting.
- Type-checked TypeScript rules.
- TypeScript stylistic rules.
- Unused ESLint disable-directive detection.
- Common generated-file and dependency-directory ignores.

Use it with:

```js
import config from "@orderflow/eslint-config/base";

export default config;
```

### `node`

The Node.js preset extends the base configuration and adds Node.js-specific globals.

Backend services should use this preset.

```js
import config from "@orderflow/eslint-config/node";

export default config;
```

## Configuration hierarchy

The configuration is intentionally layered:

```text
@orderflow/eslint-config/base
            │
            ├── JavaScript rules
            ├── TypeScript rules
            ├── Type-aware linting
            └── common repository ignores
                    │
                    ▼
@orderflow/eslint-config/node
            │
            └── Node.js environment
                    │
             ┌──────┴──────┐
             ▼             ▼
        order-api      order-worker
```

The responsibilities are separated as follows:

- `base.mjs` — common ESLint and TypeScript linting policy.
- `node.mjs` — Node.js-specific environment configuration.
- Application `eslint.config.mjs` — application-specific rules and overrides.

## Type-aware linting

The configuration uses `typescript-eslint` type-aware linting.

The Node.js services should therefore have a valid `tsconfig.json` that describes the source files being linted.

The ESLint configuration uses TypeScript's Project Service rather than requiring a separate ESLint-specific TypeScript configuration.

This keeps ESLint and the TypeScript compiler aligned around the same project configuration.

## Service usage

A backend service can consume the Node.js preset with:

```js
import config from "@orderflow/eslint-config/node";

export default config;
```

The service can then append application-specific configuration when required:

```js
import config from "@orderflow/eslint-config/node";
import { defineConfig } from "eslint/config";

export default defineConfig(
  config,

  {
    rules: {
      // Service-specific rules belong here.
    },
  },
);
```

Shared rules should not be copied into individual applications.

If a rule should apply consistently across all OrderFlow backend services, it belongs in this package instead.

## Dependencies

The configuration package owns the dependencies required to implement the shared ESLint configuration.

These include:

- `eslint`
- `@eslint/js`
- `typescript`
- `typescript-eslint`
- `globals`

Individual services consume the configuration package rather than independently maintaining separate copies of these configuration dependencies.

## Design principles

This package follows several rules:

1. Use ESLint flat configuration.
2. Keep shared linting policy centralized.
3. Keep runtime-specific configuration separate from generic linting configuration.
4. Prefer type-aware linting for TypeScript backend services.
5. Keep application-specific rules inside the application.
6. Avoid duplicating shared rules across services.
7. Ignore generated artifacts and dependency directories centrally.

The package is internal to the OrderFlow workspace and is not intended for publication to npm.
