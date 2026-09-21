# @orderflow/typescript-config

Shared TypeScript configuration presets for the OrderFlow monorepo.

This package provides reusable TypeScript configurations for workspace applications and packages. It centralizes TypeScript configuration without coupling individual services to repository-relative configuration paths.

## Available presets

### `base`

The base preset inherits the repository-wide TypeScript policy from:

```text
tsconfig.base.json
```

Use it for packages that do not require Node.js-specific compiler settings.

```json
{
  "extends": "@orderflow/typescript-config/base"
}
```

### `node`

The Node.js preset extends `base` and adds Node.js-specific module resolution and runtime type configuration.

It uses:

```text
module: NodeNext
moduleResolution: NodeNext
types: ["node"]
```

Backend services should normally use this preset.

```json
{
  "extends": "@orderflow/typescript-config/node"
}
```

## Configuration hierarchy

The configuration is intentionally layered:

```text
tsconfig.base.json
        │
        ▼
base.json
        │
        ▼
node.json
        │
        ├───────────────┐
        ▼               ▼
   order-api       order-worker
```

The responsibilities are separated as follows:

- `tsconfig.base.json` — repository-wide TypeScript policy.
- `base.json` — reusable package-facing base preset.
- `node.json` — Node.js-specific TypeScript settings.
- Application `tsconfig.json` — application-specific compilation boundaries.

## Application-specific configuration

Individual applications own settings that depend on their filesystem or build process.

For example:

```json
{
  "extends": "@orderflow/typescript-config/node",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "noEmit": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

The shared presets intentionally do not define `rootDir`, `outDir`, `include`, or `exclude`.

## Dependencies

This package contains configuration only. It has no runtime dependencies.

Node.js applications consuming the `node` preset must provide their own Node.js type definitions:

```bash
pnpm add -D @types/node
```

The TypeScript compiler itself should also be owned by the appropriate workspace tooling/application package rather than being treated as a runtime dependency of this configuration package.

## Design principles

This package follows four rules:

1. Keep shared compiler policy centralized.
2. Keep runtime-specific configuration separate from generic TypeScript configuration.
3. Keep application-specific filesystem settings inside the application.
4. Avoid duplicating compiler options across services.

The configuration package is internal to the OrderFlow workspace and is not intended for publication to npm.
