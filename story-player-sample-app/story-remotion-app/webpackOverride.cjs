/*
 * Shared webpack override, used by BOTH remotion.config.ts (Studio/CLI) and
 * server.mjs (programmatic bundle for the render endpoint) — @remotion/bundler
 * does not read remotion.config.ts, so the override must be importable.
 *
 * It reproduces the resolution tricks the sibling Vite app needs to consume the
 * monorepo's source packages (see ../story-player-vite-app/vite.config.ts):
 *   1. Alias every `@googleforcreators/*` import to that package's src entry.
 *   2. babel-compile the packages' JSX-in-.js / .ts / .tsx.
 *   3. Force a single React 18 / styled-components instance (the monorepo root
 *      is pinned to React 17; this app runs React 18, Remotion's requirement).
 *
 * Paths are anchored on process.cwd(): both the Remotion CLI and the render
 * server are launched from this app's directory.
 */
const path = require('node:path');
const fs = require('node:fs');

function buildPackageAliases(packagesDir) {
  const aliases = {};
  for (const dir of fs.readdirSync(packagesDir)) {
    const srcDir = path.join(packagesDir, dir, 'src');
    if (!fs.existsSync(srcDir)) {
      continue;
    }
    const entry = ['index.ts', 'index.tsx', 'index.js'].find((f) =>
      fs.existsSync(path.join(srcDir, f))
    );
    if (entry) {
      // Exact match ($) so subpath imports fall through to normal resolution.
      aliases[`@googleforcreators/${dir}$`] = path.join(srcDir, entry);
    }
  }
  return aliases;
}

module.exports = function webpackOverride(config) {
  const appDir = process.cwd();
  const monorepoRoot = path.resolve(appDir, '../..');
  const packagesDir = path.resolve(monorepoRoot, 'packages');

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
        ...((config.resolve && config.resolve.extensions) || []),
      ],
      alias: {
        ...((config.resolve && config.resolve.alias) || {}),
        ...buildPackageAliases(packagesDir),
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
        ...((config.module && config.module.rules) || []),
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [packagesDir],
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              presets: [
                [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
                require.resolve('@babel/preset-typescript'),
              ],
              plugins: [require.resolve('babel-plugin-styled-components')],
            },
          },
        },
      ],
    },
  };
};
