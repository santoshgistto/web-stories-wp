import type { NextConfig } from "next";
import path from "node:path";

// Next 16 compiles next.config.ts into a hybrid CJS/ESM bundle that doesn't
// expose `import.meta.url`. Resolve paths against the cwd Next was invoked
// from instead — `npm run dev` / `next build` always run from this app dir.
const appDir = process.cwd();
const monorepoRoot = path.resolve(appDir, "../..");

// The monorepo's packages publish only a non-standard `customExports` field
// pointing to TS/JS source — Next's resolvers (Turbopack and webpack) read
// the standard `module` / `exports` / `main` fields, which don't exist on
// these packages. Alias each `@googleforcreators/*` directly to
// `packages/<name>/src/index` so we can consume the live source without
// running a full rollup build first.
const aliasedPackages = [
  "animation",
  "design-system",
  "element-library",
  "elements",
  "fonts",
  "i18n",
  "masks",
  "media",
  "patterns",
  "react",
  "rich-text",
  "story-player",
  "stickers",
  "templates",
  "text-sets",
  "transform",
  "units",
  "url",
];

const gcAliases = (): Record<string, string> =>
  Object.fromEntries(
    aliasedPackages.map((name) => [
      `@googleforcreators/${name}`,
      path.resolve(monorepoRoot, `packages/${name}/src/index`),
    ])
  );

// (Previously this file scoped a `react`/`react-dom` alias to packages/.
// That fragmented React across the bundle: Next aliases `react` → its own
// `next/dist/compiled/react` (canary) for app-pages-browser, while our
// scoped alias pointed packages/ at `appDir/node_modules/react@19.2.4`.
// Two React copies → hooks throw. Removing the scoped alias lets Next's
// built-in alias apply uniformly, so every file in the bundle — Next's
// internals and our packages/ — uses one React.)

const nextConfig: NextConfig = {
  // SWC handles styled-components for both client and SSR; without this the
  // styled component class names mismatch between server and client and you
  // get rehydration errors.
  compiler: {
    styledComponents: true,
  },
  // We run dev with `next dev --webpack` (see package.json `dev` script).
  // Turbopack's `resolveAlias` only supports module-name → module-name
  // renaming (e.g. `underscore: 'lodash'`), not absolute file paths, so it
  // can't redirect `@googleforcreators/*` to our local source. Webpack
  // alias does accept absolute paths and gives us the behaviour we need.
  webpack(config) {
    config.resolve = config.resolve || {};
    // @googleforcreators/* alias is safe to apply globally — those module
    // names don't appear anywhere inside Next.
    //
    // react-dom/server.browser is stubbed because @googleforcreators/react
    // re-exports renderToStaticMarkup, which forces react-dom/server.browser
    // to evaluate (running a React/ReactDOM version check) at module init
    // time. Next 16's app-pages-browser bundle ships a canary react that
    // doesn't match the installed react-dom, so the check throws. The
    // player never actually needs server rendering — stub it out.
    config.resolve.alias = {
      ...((config.resolve.alias as Record<string, string>) || {}),
      ...gcAliases(),
      "react-dom/server.browser": path.resolve(
        appDir,
        "stubs/react-dom-server.js"
      ),
      "react-dom/server": path.resolve(appDir, "stubs/react-dom-server.js"),
      // Dedupe styled-components. Two physical copies exist (one hoisted at
      // the monorepo root, one in this Next app's node_modules) and they
      // each have their own ThemeContext module instance — so a
      // <ThemeProvider> in app/page.tsx wouldn't reach styled-components
      // imported from packages/, leaving `theme` undefined inside them.
      "styled-components": path.resolve(
        appDir,
        "node_modules/styled-components"
      ),
    };

    const packagesDir = path.resolve(monorepoRoot, "packages") + path.sep;
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    // SVG → React component (via SVGR). The monorepo's element-library
    // imports SVG icons and wraps them with styled-components — Next's
    // default static-import handler returns a `{src, width, height}` object,
    // not a component, which styled-components rejects. Exclude .svg from
    // Next's default rule and add an SVGR rule for files in our packages/.
    type RuleEntry = { test?: RegExp | { test?: (s: string) => boolean }; exclude?: RegExp | RegExp[] };
    const rules = config.module.rules as RuleEntry[];
    for (const rule of rules) {
      const test = rule?.test;
      if (test instanceof RegExp && test.test(".svg")) {
        rule.exclude = /\.svg$/i;
      }
    }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      include: packagesDir,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            titleProp: true,
            svgo: true,
            memo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                "removeDimensions",
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
