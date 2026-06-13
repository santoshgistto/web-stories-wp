# story-remotion-app

Render a Web Story to an MP4 video with [Remotion](https://www.remotion.dev),
reusing `@googleforcreators/story-player` to render pages and **driving its
WAAPI animations from Remotion's frame clock** so the output is animated and
deterministic.

## Why this is a standalone app

Remotion requires React 18, but the monorepo (and the sibling
`story-player-vite-app`) is pinned to React 17. So this app:

- is **not** an npm workspace member — it has its own `node_modules` with React 18;
- aliases `react` / `react-dom` / `styled-components` to its local copies so the
  React-17-authored player packages run on a single React 18 instance;
- aliases `@googleforcreators/*` to each package's `src/index` and compiles the
  monorepo's JSX-in-`.js` / `.ts` / `.tsx` with babel.

All of that lives in [`remotion.config.ts`](./remotion.config.ts), mirroring the
Vite app's `vite.config.ts`.

## How animation export works

`PreviewPage` gained an optional `currentTimeMs` prop. When set, instead of
playing animations in real time it seeks every WAAPI animation (which live on
`document.timeline`) to that offset via `WAAPIAnimationMethods.setCurrentTime`.
`StoryPage` computes `currentTimeMs` from `useCurrentFrame()`, making every
rendered frame reproducible.

Each page becomes a `Series.Sequence`; its length comes from the page's
animation durations (see [`src/timing.ts`](./src/timing.ts)).

## Usage

```bash
npm install

# Preview & tweak compositions in the browser
npm run dev          # remotion studio

# Render to out/video.mp4
npm run render
```

To render a different story, replace [`src/story.json`](./src/story.json) with an
exported Web Story document (the `{ pages: [...] }` shape).
