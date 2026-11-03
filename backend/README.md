# DocuMind AI backend

NestJS technical foundation for the DocuMind AI API. This increment provides PostgreSQL connectivity, health checks, OpenAPI and normalized errors. It does not yet implement authentication or business modules.

## Prerequisites

- Bun 1.3.14 or newer compatible release.
- Node.js 24.11 or newer for Prisma 7 tooling.
- Docker with Compose for the local PostgreSQL service.

## Local setup

Copy `.env.example` to `.env`, then install and generate the Prisma client:

```bash
bun install --frozen-lockfile
bun run prisma:generate
```

Start PostgreSQL from the repository root:

```bash
docker compose up -d postgres
```

Start the API from this directory:

```bash
bun run start:dev
```

The API listens on `http://localhost:3001` by default.

## Technical endpoints

- `GET /api/v1/health/live`: process liveness; does not query PostgreSQL.
- `GET /api/v1/health/ready`: service readiness; verifies PostgreSQL.
- `/api/docs`: OpenAPI UI in development and test environments.

## Database changes

The initial Prisma schema intentionally contains no business models. Once a model and its rules are approved:

```bash
bun run prisma:migrate -- --name descriptive_migration_name
```

Review the generated SQL before applying or publishing it. Use `bun run prisma:deploy` in controlled deployment environments. Do not use `db push` as a migration strategy.

## Verification

```bash
bun run lint
bun run typecheck
bun run test
bun run test:e2e
bun run build
```

E2E tests require a real PostgreSQL database. Set `TEST_DATABASE_URL` when it differs from the default local test URL.

To build and run the complete local foundation from the repository root:

```bash
docker compose up --build
```

The credentials in the example and Compose defaults are for isolated local development only.
