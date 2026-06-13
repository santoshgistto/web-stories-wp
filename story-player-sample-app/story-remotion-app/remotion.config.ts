/*
 * Remotion configuration.
 *
 * Remotion bundles compositions with its own webpack instance, so this file
 * reproduces the resolution tricks the sibling Vite app needs to consume the
 * monorepo's source packages (see ../story-player-vite-app/vite.config.ts):
 *
 *   1. Alias every `@googleforcreators/*` import to that package's `src/index`
 *      (the packages ship a custom `customExports`/`source` field, not the
 *      standard `main`/`module`, so without this webpack can't find them).
 *   2. Compile the packages' JSX-in-.js / .ts / .tsx with babel — the monorepo
 *      mixes JSX into plain .js files, which webpack won't parse otherwise.
 *   3. Force a single React / styled-components instance. The monorepo root is
 *      pinned to React 17; this app runs React 18 (Remotion's requirement), so
 *      we alias react/react-dom/styled-components to THIS app's node_modules.
 */
import { Config } from '@remotion/cli/config';
import path from 'node:path';
import fs from 'node:fs';

// Remotion evals this config in its own module context, so `__dirname` points
// into @remotion/cli rather than here. The CLI is always launched from the app
// root (via the npm scripts), so cwd is the reliable anchor.
const appDir = process.cwd();
const monorepoRoot = path.resolve(appDir, '../..');
const packagesDir = path.resolve(monorepoRoot, 'packages');

// Build `@googleforcreators/<dir>` -> `packages/<dir>/src/index` for every
// package that actually has a source entry. Exact-match (`$`) so subpath
// imports, if any, fall through to normal resolution.
function buildPackageAliases(): Record<string, string> {
  const aliases: Record<string, string> = {};
  for (const dir of fs.readdirSync(packagesDir)) {
    const srcDir = path.join(packagesDir, dir, 'src');
    if (!fs.existsSync(srcDir)) {
      continue;
    }
    const entry = ['index.ts', 'index.tsx', 'index.js'].find((f) =>
      fs.existsSync(path.join(srcDir, f))
    );
    if (entry) {
      aliases[`@googleforcreators/${dir}$`] = path.join(srcDir, entry);
    }
  }
  return aliases;
}

Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('jpeg');
// Headless Chrome on the render host needs no sandbox in most CI/dev setups.
Config.setChromiumOpenGlRenderer('angle');

Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      extensions: [
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.json',
        ...(config.resolve?.extensions ?? []),
      ],
      alias: {
        ...(config.resolve?.alias ?? {}),
        ...buildPackageAliases(),
        // Single instances — duplicates break hooks, context and
        // styled-components' ThemeProvider. Point at THIS app's copies.
        react: path.resolve(appDir, 'node_modules/react'),
        'react-dom': path.resolve(appDir, 'node_modules/react-dom'),
        'styled-components': path.resolve(
          appDir,
          'node_modules/styled-components'
        ),
      },
    },
    module: {
      ...config.module,
      rules: [
        ...(config.module?.rules ?? []),
        {
          // The monorepo source: strip TS types and transform JSX (including
          // JSX inside .js files). Modern JS syntax is left as-is — Remotion
          // renders in a current Chromium that runs it natively.
          test: /\.(js|jsx|ts|tsx)$/,
          include: [packagesDir],
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              presets: [
                [
                  require.resolve('@babel/preset-react'),
                  { runtime: 'automatic' },
                ],
                require.resolve('@babel/preset-typescript'),
              ],
              plugins: [require.resolve('babel-plugin-styled-components')],
            },
          },
        },
      ],
    },
  };
});
