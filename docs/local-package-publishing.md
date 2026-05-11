# Local Package Publishing

This repo is an npm workspaces monorepo. The packages under [packages/](../packages/) (e.g. `@googleforcreators/design-system`, `@googleforcreators/story-editor`) can be built and published to a **local npm registry** for testing in other projects without pushing to npmjs.org.

The registry is provided by [Verdaccio](https://verdaccio.org/), which proxies any package it doesn't host locally to the public npm registry — so consumers see a normal-looking registry that just happens to override the packages you've published.

## Prerequisites

- Node.js `>= 24` and npm `>= 10` (see [package.json:24-27](../package.json#L24-L27))
- A clean workspace install: `npm install`

## 1. Start the local registry

```bash
npm run local-registry:start
```

This runs [bin/setup-local-npm-registry.sh](../bin/setup-local-npm-registry.sh), which:

1. Boots Verdaccio in the background using [bin/verdaccio-config.yml](../bin/verdaccio-config.yml).
2. Installs `verdaccio-memory` globally.
3. Waits for `http address` to appear in the log, then logs in as `admin / password` via `npm-cli-login`.

The registry listens on **http://localhost:4873**. Storage lives at `/tmp/verdaccio-workspace/storage`.

> Default credentials: `admin` / `password` / `test@example.com`. These are baked into the setup script — fine for local use, never use this config in production.

## 2. Build the packages

```bash
npm run workflow:bundle-packages
```

This runs two steps in parallel ([package.json:280-282](../package.json#L280-L282)):

- `workflow:bundle-packages:code` — Rollup bundles each package's source per [rollup.config.js](../rollup.config.js).
- `workflow:bundle-packages:types` — `tsc --build` emits `.d.ts` declarations.

## 3. Publish to the local registry

Publish every workspace package at once:

```bash
npm publish --workspaces --registry=http://localhost:4873
```

Or publish a single package:

```bash
npm publish --workspace=packages/design-system --registry=http://localhost:4873
```

Verdaccio's web UI at http://localhost:4873 shows everything that's been published.

> **Bumping versions:** `npm publish` will reject a version that already exists in the registry. Either bump the version in the package's `package.json` before publishing, or `npm unpublish <pkg>@<version> --registry=http://localhost:4873 --force` first.

## 4. Consume the packages from another project

Point npm at the local registry, either per-project via `.npmrc`:

```ini
# .npmrc in the consumer project
registry=http://localhost:4873
```

…or per-command:

```bash
npm install @googleforcreators/design-system --registry=http://localhost:4873
```

Packages that aren't published locally are transparently proxied to npmjs.org, so a single `.npmrc` works for the whole project.

## 5. Stop the registry

```bash
npm run local-registry:stop
```

Runs [bin/stop-local-npm-registry.sh](../bin/stop-local-npm-registry.sh) and tears down the Verdaccio process.

## Troubleshooting

- **`EPUBLISHCONFLICT` when publishing** — the version already exists. Bump it or unpublish first.
- **Consumer still resolves the public version** — confirm the registry override with `npm config get registry` (or `npm config get registry --location=project`). The `--registry` flag and `.npmrc` win over the global config.
- **Verdaccio didn't start** — check the log path printed by the setup script (a path under `$TMPDIR`), or kill any stray process on port `4873` (`lsof -i :4873`).
- **Storage looks stale** — `rm -rf /tmp/verdaccio-workspace/storage` clears everything published locally.

## Related

- [Local Environment](./local-environment.md) — running the WordPress plugin locally (Docker / Local).
- [Getting Started](./getting-started.md) — overall contributor setup.
