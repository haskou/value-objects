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

Dependency maintenance PRs titled `chore(deps): ...` do not publish to npm,
including older Renovate PRs whose branches still use `break/*`. Renovate uses
`chore/*` branches for development dependencies and GitHub Actions updates.
Major development dependency and Action updates still require manual review.
Runtime dependency updates retain the release branch policy above.
Renovate explicitly titles major dependency updates `break(deps): ...` before
applying the development-tool and GitHub Actions maintenance exceptions.

## Before opening a release PR

```bash
yarn lint
yarn test
yarn build
```

## What CI publishes

After the release queue completes, CI reads npm's `latest` version and synchronizes `package.json` on the base branch with a dedicated `chore(release)` commit. It starts from the latest remote commit and retries rejected pushes without force-pushing. Re-running the workflow does not create another commit when the version already matches. Registry errors and version downgrades fail the synchronization instead of writing an unverified version.

The synchronization commit does not create a new release or change the historical release baseline. Published tags continue to identify the original source snapshots.

The package publishes only the compiled `dist` directory.

The package metadata declares:

- CommonJS entrypoint: `dist/index.cjs` with `dist/index.d.cts` declarations
- ESM entrypoint: `dist/index.mjs` with `dist/index.d.mts` declarations
- `sideEffects: false`
- Public npm access

The ESM entrypoint re-exports the CommonJS implementation, preserving class identity and shared configuration when consumers mix `import` and `require`. The build verifies both entrypoints and their declarations before publication.
