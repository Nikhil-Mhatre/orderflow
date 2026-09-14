Bash

```
# Development environment
docker compose --env-file .env.dev -f docker-compose.dev.yml up --build
```

Bash

```
# Development environment in detached mode
docker compose --env-file .env.dev -f docker-compose.dev.yml up --build -d
```

Bash

```
# Check development containers
docker compose --env-file .env.dev -f docker-compose.dev.yml ps
```

Bash

```
# View development API logs
docker compose --env-file .env.dev -f docker-compose.dev.yml logs -f order-api
```

Bash

```
# View development PostgreSQL logs
docker compose --env-file .env.dev -f docker-compose.dev.yml logs -f postgres
```

Bash

```
# Run development database migrations
docker compose --env-file .env.dev -f docker-compose.dev.yml exec order-api pnpm run db:migrate
```

Bash

```
# Stop development environment
docker compose --env-file .env.dev -f docker-compose.dev.yml down
```

Bash

```
# Stop development environment and delete its database volume
docker compose --env-file .env.dev -f docker-compose.dev.yml down -v
```

Bash

```
# Production environment
docker compose --env-file .env.prod -f docker-compose.prod.yml up --build -d
```

Bash

```
# Check production containers
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
```

Bash

```
# View production API logs
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f order-api
```

Bash

```
# View production PostgreSQL logs
docker compose --env-file .env.prod -f docker-compose.prod.yml logs -f postgres
```

Bash

```
# Run production database migrations
docker compose --env-file .env.prod -f docker-compose.prod.yml exec order-api pnpm run db:migrate
```

Bash

```
# Stop production environment
docker compose --env-file .env.prod -f docker-compose.prod.yml down
```

Bash

```
# Restart production environment
docker compose --env-file .env.prod -f docker-compose.prod.yml restart
```

Bash

```
# Rebuild and restart production environment
docker compose --env-file .env.prod -f docker-compose.prod.yml up --build -d
```
