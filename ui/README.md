# @paperclipai/ui

Published static assets for the Paperclip board UI.

## What gets published

The npm package contains the production build under `dist/`. It does not ship the UI source tree or workspace-only dependencies.

## Typical use

Install the package, then serve or copy the built files from `node_modules/@paperclipai/ui/dist`.

## Local dev host allowlist

Vite blocks unknown hostnames by default. If you run the dev UI through a tunnel or custom domain, set a comma-separated allowlist instead of editing `vite.config.ts`:

```sh
PAPERCLIP_UI_ALLOWED_HOSTS=paperclip.example.test,preview.example.test pnpm dev:ui
```
