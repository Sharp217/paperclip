# Daily Code Audit — Paperclip

Generated: 2026-09-06 02:00 CDT  
Project: Paperclip  
Repo path: `/Users/matter/paperclip`  
Branch: `backup/fleet-os-adoption-20260902-081407`  
Tracked files: 1305

## Verdict
watch — The repo is well-structured and heavily tested, but plugin execution/logging surfaces carry enough sharp edges that they deserve cleanup before more production use.

## Top Findings
1. `server/src/middleware/error-handler.ts` + `server/src/middleware/logger.ts`: error logging attaches and persists raw `req.body`, `req.params`, and `req.query` for failed requests, while `server/src/log-redaction.ts` only masks current usernames/home paths. This can write tokens, passwords, plugin config values, or auth challenge fields into `server.log` during 4xx/5xx responses.
2. `server/src/services/plugin-loader.ts`: `loadManifestFromPath()` dynamically imports the plugin manifest (`await import(manifestPath)`) during install/validation, and local-path installs accept arbitrary paths from `server/src/routes/plugins.ts` when `isLocalPath` is true. Even with npm `--ignore-scripts`, manifest import is code execution before sandboxed worker loading; that should be explicit/trusted-only and tightly documented or constrained.
3. `server/src/services/issues.ts`: the issue service is a 1,922-line module spanning filtering, status transitions, workspace inheritance, labels, comments, read-state, activity-log joins, and goal fallback. It has tests, but the boundary is fragile: small changes risk accidental cross-company/query behavior regressions because too much policy and query composition lives in one file.

## Fastest Safe Cleanup Task
Add a centralized `redactLogPayload()` helper and use it in `error-handler.ts` / `logger.ts` before attaching request bodies, params, and queries; include tests with keys like `password`, `token`, `secret`, `authorization`, and nested plugin config objects.

## Checks Actually Run
- Read: `package.json`, `server/package.json`, `ui/package.json`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `tsconfig.base.json`, `tsconfig.json`, `server/tsconfig.json`, `ui/tsconfig.json`.
- Read: `server/src/middleware/error-handler.ts`, `server/src/middleware/logger.ts`, `server/src/log-redaction.ts`, `server/src/__tests__/log-redaction.test.ts`, `server/src/__tests__/error-handler.test.ts`.
- Read: `server/src/services/plugin-runtime-sandbox.ts`, `server/src/services/plugin-loader.ts`, `server/src/routes/plugins.ts`, `server/src/services/access.ts`, `server/src/services/issues.ts`, `packages/shared/src/validators/plugin.ts`.
- Searches: package manifests, server/shared/test file inventory, TODO/FIXME/HACK/XXX, `as any`/`unknown as`, plugin install/local path/dynamic load patterns.
- Git: `git status --short`, `git rev-parse --abbrev-ref HEAD`, `git rev-parse HEAD`, `git remote -v`.

## Skipped / Boundaries
Read-only product inspection only. I did not retrieve/read/test credentials, `.env`, keychains, token/private-key files, dependency/build folders, or external services. No product code/config/package edits were made; only audit reports were written.

## Repo Snapshot
Git status from script context:
```text
## backup/fleet-os-adoption-20260902-081407
?? docs/audits/
```

Recent commits from script context:
```text
c1080549b Configure Vite allowed hosts from env
a09a44417 chore: wire Fleet OS operational routing
e6221e799 chore: add Fleet OS agent bootloaders
5b479652f Merge pull request #2327 from radiusred/fix/env-var-plain-to-secret-data-loss
92e03ac4e fix(ui): prevent dropdown snap-back when switching env var to Secret
```
