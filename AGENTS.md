# AGENTS.md

Guidance for human and AI contributors working in this repository.

## 1. Purpose

Paperclip is a control plane for AI-agent companies.
The current implementation target is V1 and is defined in `doc/SPEC-implementation.md`.

## 2. Read This First

Before making changes, read in this order:

1. `doc/GOAL.md`
2. `doc/PRODUCT.md`
3. `doc/SPEC-implementation.md`
4. `doc/DEVELOPING.md`
5. `doc/DATABASE.md`

`doc/SPEC.md` is long-horizon product context.
`doc/SPEC-implementation.md` is the concrete V1 build contract.

## 3. Repo Map

- `server/`: Express REST API and orchestration services
- `ui/`: React + Vite board UI
- `packages/db/`: Drizzle schema, migrations, DB clients
- `packages/shared/`: shared types, constants, validators, API path constants
- `packages/adapters/`: agent adapter implementations (Claude, Codex, Cursor, etc.)
- `packages/adapter-utils/`: shared adapter utilities
- `packages/plugins/`: plugin system packages
- `doc/`: operational and product docs

## 4. Dev Setup (Auto DB)

Use embedded PGlite in dev by leaving `DATABASE_URL` unset.

```sh
pnpm install
pnpm dev
```

This starts:

- API: `http://localhost:3100`
- UI: `http://localhost:3100` (served by API server in dev middleware mode)

Quick checks:

```sh
curl http://localhost:3100/api/health
curl http://localhost:3100/api/companies
```

Reset local dev DB:

```sh
rm -rf data/pglite
pnpm dev
```

## 5. Core Engineering Rules

1. Keep changes company-scoped.
Every domain entity should be scoped to a company and company boundaries must be enforced in routes/services.

2. Keep contracts synchronized.
If you change schema/API behavior, update all impacted layers:
- `packages/db` schema and exports
- `packages/shared` types/constants/validators
- `server` routes/services
- `ui` API clients and pages

3. Preserve control-plane invariants.
- Single-assignee task model
- Atomic issue checkout semantics
- Approval gates for governed actions
- Budget hard-stop auto-pause behavior
- Activity logging for mutating actions

4. Do not replace strategic docs wholesale unless asked.
Prefer additive updates. Keep `doc/SPEC.md` and `doc/SPEC-implementation.md` aligned.

5. Keep plan docs dated and centralized.
New plan documents belong in `doc/plans/` and should use `YYYY-MM-DD-slug.md` filenames.

## 6. Database Change Workflow

When changing data model:

1. Edit `packages/db/src/schema/*.ts`
2. Ensure new tables are exported from `packages/db/src/schema/index.ts`
3. Generate migration:

```sh
pnpm db:generate
```

4. Validate compile:

```sh
pnpm -r typecheck
```

Notes:
- `packages/db/drizzle.config.ts` reads compiled schema from `dist/schema/*.js`
- `pnpm db:generate` compiles `packages/db` first

## 7. Verification Before Hand-off

Run this full check before claiming done:

```sh
pnpm -r typecheck
pnpm test:run
pnpm build
```

If anything cannot be run, explicitly report what was not run and why.

## 8. API and Auth Expectations

- Base path: `/api`
- Board access is treated as full-control operator context
- Agent access uses bearer API keys (`agent_api_keys`), hashed at rest
- Agent keys must not access other companies

When adding endpoints:

- apply company access checks
- enforce actor permissions (board vs agent)
- write activity log entries for mutations
- return consistent HTTP errors (`400/401/403/404/409/422/500`)

## 9. UI Expectations

- Keep routes and nav aligned with available API surface
- Use company selection context for company-scoped pages
- Surface failures clearly; do not silently ignore API errors

## 10. Definition of Done

A change is done when all are true:

1. Behavior matches `doc/SPEC-implementation.md`
2. Typecheck, tests, and build pass
3. Contracts are synced across db/shared/server/ui
4. Docs updated when behavior or commands change

<!-- BEGIN:fleet-os-bootloader -->

## Fleet OS / AI SDLC rules

This repo participates in matter's Fleet OS.

Before nontrivial work:

1. Treat GitHub remote as source of truth for committed state, while preserving dirty local work as possible in-flight work from another window.
2. Run Project Boot: identify repo path, branch, local HEAD, remote HEAD, sync state, dirty files, open PRs, relevant docs read, contradictions, blockers, and proposed next step.
3. Read central reusable methods only when needed:
   - `/Users/matter/Documents/GitHub/agent-frameworks/AGENTS.md`
   - `/Users/matter/Documents/GitHub/agent-frameworks/CLAUDE.md`
   - `/Users/matter/Documents/GitHub/agent-frameworks/ops/fleet-os/README.md`
   - `/Users/matter/Documents/GitHub/agent-frameworks/ops/fleet-os/skills/project-boot/skill.md`
   - `/Users/matter/Documents/GitHub/agent-frameworks/ops/fleet-os/skills/ai-sdlc-artifact-chain/skill.md`
4. For meaningful features, risky edits, multi-agent work, or work that may cross windows, use the artifact chain:
   - `intent/intent.md`
   - `spec/spec.md`
   - `plan/plan.md`
   - build log
   - review
   - release gate
   Templates live in `/Users/matter/Documents/GitHub/agent-frameworks/ops/fleet-os/templates/`.
5. Use Firecrawl/Apify only for scoped public-source extraction with citations. Use Composio only for authenticated app actions with explicit approval before external side effects.
6. Approval ladder is per step: build is not commit, commit is not push, push is not PR, PR is not merge, merge is not deploy.
7. Before parking or closing work, write a durable handoff that states what is committed, pushed, local-only, blocked, or unsafe to close.

<!-- END:fleet-os-bootloader -->
