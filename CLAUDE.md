# Project

## Development commands

### Starting the stack

```bash
pnpm infra:up        # start PostgreSQL on port 5433 (Docker)
pnpm dev             # start all apps via Turborepo (api :3000, frontend :5173)
```

### Per-app dev (from repo root)

```bash
pnpm -F api dev      # NestJS API only
pnpm -F frontend dev # Vite frontend only
```

### Database

```bash
pnpm db:migrate      # apply pending migrations
pnpm db:studio       # open Drizzle Studio
# From packages/db:
pnpm -F @project/db db:generate  # generate migration after schema change
```

### Lint, format, type-check

```bash
pnpm lint            # oxlint across all packages
pnpm lint:fix        # auto-fix lint errors
pnpm fmt             # oxfmt formatter across all packages
pnpm type-check      # oxlint type-check (not tsc)
```

### Tests (API only)

```bash
pnpm -F api test              # run all unit tests
pnpm -F api test:watch        # watch mode
# run a single test file:
pnpm -F api test -- tests/unit/cat/cat.service.test.ts
```

### Build

```bash
pnpm build           # turbo build (api → tsdown → ESM, frontend → vite)
```

## Environment setup

Copy `env/backend.env.example` → `env/backend.env`. Drizzle reads this file directly. The API reads it at startup via `process.loadEnvFile()`.

Frontend: create `apps/frontend/.env` with `VITE_API_URL=http://localhost:3000/api`.

Default DB credentials match the Docker Compose service (`project_dev / dev_password`, port `5433`).

## Architecture

### Monorepo layout

```
apps/
  api/        NestJS + Fastify, built with tsdown → ESM bundle
  frontend/   React 19 + Vite + Tailwind v4 + shadcn/ui
packages/
  db/         Drizzle ORM schema, migrations, DB client (@project/db)
  config/     Shared tsconfig files and Vite plugins (@project/config)
env/          Environment files (gitignored except .example)
infra/        Docker Compose files
```

### API (`apps/api`)

- **NestJS** on **Fastify** adapter. All routes are prefixed with `/api` (set in `server.ts`).
- Swagger docs available at `http://localhost:3000/docs`.
- Module tree lives under `src/module/core/`. Each feature gets a folder with `<name>.module.ts`, `<name>.controller.ts`, `<name>.service.ts`, and a `dto/` subfolder — mirror the existing `cat` module as the template.
- Config is centralized in `src/config/index.ts`. Add new env vars there; never read `process.env` directly elsewhere.
- Built via **tsdown**: workspace packages (e.g. `@project/db`) are always bundled into the output so the dist is a single self-contained ESM file.

### Database (`packages/db`)

- **Drizzle ORM** with PostgreSQL. Schemas live in `src/schema/core/` — one file per table.
- After adding a new schema file, export it from `src/schema/core/index.ts` so it's re-exported by `@project/db`.
- The `relations.ts` file spreads all core schemas into `defineRelations` for relational queries — it picks up new tables automatically via `...coreSchema`.
- Migrations are stored in `packages/db/migrations/`. Always run `db:generate` then `db:migrate` after schema changes.

### Frontend (`apps/frontend`)

- React 19, `@tanstack/react-query` for data fetching, axios via `src/lib/http.ts` (baseURL from `VITE_API_URL`).
- UI components are shadcn/ui (Radix + Tailwind v4). Path alias `@/` maps to `src/`.
- No router pages yet — currently a single-page app rooted at `src/main.tsx`.

## Key conventions

- **`verbatimModuleSyntax`** is enabled globally. Use `import type` for any import that's only used as a type — oxlint enforces `typescript/consistent-type-imports`.
- **Linter is oxlint**, not ESLint. Rules live in `.oxlintrc.json` at the repo root. `import/no-cycle` is disabled (memory constraint).
- `no-console` is a warning; `console.warn`, `console.error`, and `console.info` are allowed.
- Unused variables with a `_` prefix are ignored by the linter.
- TypeScript path alias `@/*` → `src/*` is set in every `tsconfig.json` (and in vitest config for tests).
