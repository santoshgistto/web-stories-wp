// Ambient declaration for @googleforcreators/story-editor. The package ships
// JS source (src/index.js) with no built dist-types, so TS can't resolve its
// types and reports TS2307. Vite still resolves the symbols correctly at
// runtime via the alias in vite.config.ts → packages/story-editor/src.
// Mirrors src/story-player-augment.d.ts; declare only what this app imports.

declare module '@googleforcreators/story-editor' {
  import type { ComponentType, ReactNode } from 'react'

  // Root editor provider. `config`/`initialEdits` accept the editor's large
  // config/state shapes, kept loose here since we only seed a no-op API and a
  // story's pages.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const StoryEditor: ComponentType<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialEdits?: any
    children?: ReactNode
  }>

  // Default editor chrome (canvas, panels, header slot).
  export const InterfaceSkeleton: ComponentType<{
    header?: ReactNode
    children?: ReactNode
  }>

  // Selector hook into the editor's story context.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useStory<T = any>(selector: (ctx: any) => T): T
}
