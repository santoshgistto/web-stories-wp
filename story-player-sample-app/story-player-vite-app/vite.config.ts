import { defineConfig, transformWithOxc, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.resolve(__dirname, '../..')

// The monorepo's webpack reads a custom `customExports` field on each
// package.json that points to the TS/JS source. Vite only knows about the
// standard `module`/`exports`/`main` fields, none of which exist on the
// source packages (they assume rollup will produce `dist-module/`). To avoid
// running a full rollup build before every `vite dev`, alias
// `@googleforcreators/*` directly to each package's `src/index` entry.

// Every monorepo package that has a `src` dir. The story editor pulls in many
// more `@googleforcreators/*` packages than the player, so rather than maintain
// a hand-written list we discover them all and exclude them from Vite's
// dep-optimizer (it can't parse their JSX-in-.js source).
const aliasedPackages = fs
  .readdirSync(path.resolve(monorepoRoot, 'packages'))
  .filter((dir) =>
    fs.existsSync(path.resolve(monorepoRoot, 'packages', dir, 'src'))
  )
  .map((dir) => `@googleforcreators/${dir}`)

// The monorepo's source files mix JSX into .js (not just .jsx/.tsx). Vite 8's
// default oxc transform refuses to parse JSX in .js — and disabling oxc isn't
// enough because @vitejs/plugin-react also configures oxc internally. Run this
// plugin with `enforce: 'pre'` so it transforms JSX-in-.js inside the monorepo
// packages BEFORE vite:oxc sees them. We use Vite's own transformWithOxc with
// an explicit `lang: 'jsx'` hint — same engine, just told what to expect.
function jsxInJsPlugin(): Plugin {
  const packagesDir = path.resolve(monorepoRoot, 'packages') + path.sep
  return {
    name: 'jsx-in-js-pre',
    enforce: 'pre',
    async transform(code, id) {
      const cleanId = id.split('?')[0]
      if (!cleanId.startsWith(packagesDir) || !cleanId.endsWith('.js')) {
        return null
      }
      // `lang: 'jsx'` alone makes oxc PARSE jsx but, for many of the monorepo's
      // .js files, leaves it untransformed (it defaults to jsx: 'preserve'),
      // and vite's core oxc pass then fails on the leftover JSX. Forcing the
      // automatic runtime makes oxc actually compile JSX -> _jsx() calls here.
      const result = await transformWithOxc(code, cleanId, {
        lang: 'jsx',
        jsx: { runtime: 'automatic' },
      })
      return { code: result.code, map: result.map }
    },
  }
}

// vite-plugin-svgr turns matched `.svg` files into React components, but emits
// raw JSX in a module whose id ends in `.svg` — which vite's core oxc pass does
// NOT treat as JSX, so it errors. Run a normal-order (post-svgr) transform that
// compiles that JSX. svgr runs as a `pre` plugin, so this default-order plugin
// sees its generated output.
function svgrJsxPlugin(): Plugin {
  return {
    name: 'svgr-jsx-transform',
    async transform(code, id) {
      const cleanId = id.split('?')[0]
      if (!cleanId.endsWith('.svg') || !/<svg|<[A-Za-z]/.test(code)) {
        return null
      }
      const result = await transformWithOxc(code, cleanId, {
        lang: 'jsx',
        jsx: { runtime: 'automatic' },
      })
      return { code: result.code, map: result.map }
    },
  }
}

export default defineConfig({
  plugins: [
    jsxInJsPlugin(),
    // The monorepo imports SVGs in `icons/` and `images/` dirs as React
    // components (via @svgr/webpack in webpack.config.cjs). Vite would import
    // them as URL strings, so the editor renders icons as <"data:image/svg…">
    // and crashes. Mirror webpack's SVGR rules here. `inline-icons/` SVGs are
    // intentionally left as assets (URL strings), as in webpack.
    svgr({
      include: ['**/icons/**/*.svg', '**/images/**/*.svg'],
      exclude: '**/inline-icons/**/*.svg',
      svgrOptions: {
        titleProp: true,
        memo: true,
        svgo: true,
        svgoConfig: {
          plugins: [
            { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
            'removeDimensions',
          ],
        },
        exportType: 'default',
      },
    }),
    svgrJsxPlugin(),
    react({
      // The aliased @googleforcreators/* sources have JSX inside .js files
      // (legacy monorepo convention). plugin-react only handles .jsx/.tsx by
      // default; widen include so .js files get plugin-react's babel pass too
      // (HMR refresh, etc.). jsxInJsPlugin above already converted JSX to JS,
      // but plugin-react can still process the result safely.
      include: /\.(jsx?|tsx?)$/,
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^@googleforcreators\/(.*)$/,
        replacement: path.resolve(monorepoRoot, 'packages/$1/src/index'),
      },
    ],
    // Single React/styled-components instance — duplicates break hooks and
    // styled-components' theme/context.
    dedupe: ['react', 'react-dom', 'styled-components'],
  },
  optimizeDeps: {
    // The aliased packages are local source, not real deps — skip Vite's
    // pre-bundling so the scanner doesn't choke on JSX-in-.js files.
    exclude: aliasedPackages,
    // Pre-bundle React (+ runtime) and remotion in the FIRST optimize pass.
    // The editor lazily renders deps like react-photo-album (media gallery) and
    // the Remotion preview; if React isn't already optimized, that late pass
    // re-bundles react-dom while react stays external -> two React copies ->
    // "Invalid hook call", which breaks editor interactions like applying an
    // animation. (No `react-dom/client`: that's React 18-only; this app is 17.)
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-photo-album',
      'remotion',
      '@remotion/player',
    ],
  },
  // draft-js (pulled in transitively via @googleforcreators/rich-text for
  // text element rendering) references Node's `global`. Webpack polyfills
  // this automatically; Vite doesn't, so we replace at build time.
  define: {
    global: 'globalThis',
  },
})
