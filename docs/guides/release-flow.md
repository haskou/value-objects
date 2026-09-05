---
title: Release flow
description: Release branch and publishing flow
---

# Release flow

Publishing is handled by CI when a pull request is merged into the default branch.

| Branch prefix | npm version bump |
| --- | --- |
| `fix/*` | Patch |
| `feat/*` | Minor |
| `break/*` | Major |

Branches without one of these prefixes still run CI, but they do not publish to npm.

## Before opening a release PR

```bash
yarn lint
yarn test
yarn build
```

## What CI publishes

The package publishes only the compiled `dist` directory.

The package metadata declares:

- CommonJS entrypoint: `dist/index.cjs` with `dist/index.d.cts` declarations
- ESM entrypoint: `dist/index.mjs` with `dist/index.d.mts` declarations
- `sideEffects: false`
- Public npm access

The ESM entrypoint re-exports the CommonJS implementation, preserving class identity and shared configuration when consumers mix `import` and `require`. The build verifies both entrypoints and their declarations before publication.
