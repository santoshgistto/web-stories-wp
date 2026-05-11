import { defineConfig, transformWithOxc, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.resolve(__dirname, '../..')

// The monorepo's webpack reads a custom `customExports` field on each
// package.json that points to the TS/JS source. Vite only knows about the
// standard `module`/`exports`/`main` fields, none of which exist on the
// source packages (they assume rollup will produce `dist-module/`). To avoid
// running a full rollup build before every `vite dev`, alias
// `@googleforcreators/*` directly to each package's `src/index` entry.

const aliasedPackages = [
  '@googleforcreators/story-player',
  '@googleforcreators/animation',
  '@googleforcreators/design-system',
  '@googleforcreators/elements',
  '@googleforcreators/element-library',
  '@googleforcreators/masks',
  '@googleforcreators/patterns',
  '@googleforcreators/react',
  '@googleforcreators/transform',
  '@googleforcreators/units',
]

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
      const result = await transformWithOxc(code, cleanId, { lang: 'jsx' })
      return { code: result.code, map: result.map }
    },
  }
}

export default defineConfig({
  plugins: [
    jsxInJsPlugin(),
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
  },
  // draft-js (pulled in transitively via @googleforcreators/rich-text for
  // text element rendering) references Node's `global`. Webpack polyfills
  // this automatically; Vite doesn't, so we replace at build time.
  define: {
    global: 'globalThis',
  },
})
