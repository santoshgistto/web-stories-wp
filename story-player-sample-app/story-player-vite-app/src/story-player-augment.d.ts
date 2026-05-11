// Module augmentation: declares the new applyTemplate / findPlaceholders
// exports for the IDE. story-player's dist-types haven't picked them up yet
// because the monorepo's composite build is currently blocked by unrelated
// upstream errors. Vite still resolves these symbols correctly at runtime
// via the alias in vite.config.ts → packages/story-player/src.

declare module '@googleforcreators/story-player' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function applyTemplate<T = any>(
    pages: T[],
    substitutions: Record<string, unknown>
  ): T[]

  export function findPlaceholders<T = unknown>(pages: T[]): Array<{
    placeholderId: string
    pageId: string
    elementId: string
    elementType: string
  }>
}
