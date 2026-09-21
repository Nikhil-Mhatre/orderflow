# @orderflow/contracts

Shared runtime contracts used by OrderFlow services.

The package contains contracts for data exchanged across service boundaries.

## Responsibilities

This package owns:

- Event schemas.
- Event versions.
- Runtime validation.
- TypeScript types derived from those schemas.

This package does not own:

- AWS SDK integrations.
- EventBridge configuration.
- SQS configuration.
- Database schemas.
- Drizzle models.
- HTTP controllers.
- Business logic.

## Events

### OrderCreated

Current version:

```text
1
```
