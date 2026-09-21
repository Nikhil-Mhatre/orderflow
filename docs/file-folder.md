```bash
orderflow/
│
├── apps/
│   │
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── ...
│   │   ├── public/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── next.config.ts
│   │
│   ├── order-api/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── middleware/
│   │   │   ├── db/
│   │   │   ├── events/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── order-worker/
│       ├── src/
│       │   ├── config/
│       │   ├── consumers/
│       │   ├── processors/
│       │   ├── repositories/
│       │   ├── events/
│       │   ├── db/
│       │   ├── app.ts
│       │   └── worker.ts
│       ├── tests/
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   │
│   ├── eslint-config/
│   └── typescript-config/
│
├── infrastructure/
│   └── terraform/
│       ├── environments/
│       │   ├── dev/
│       │   └── prod/
│       └── modules/
│
├── docker/
│   └── docker-compose.yml
│
├── scripts/
│   ├── check-workspace.mjs
│   └── ...
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── terraform.yml
│
├── .gitignore
├── .dockerignore
├── .editorconfig
├── .npmrc
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```
