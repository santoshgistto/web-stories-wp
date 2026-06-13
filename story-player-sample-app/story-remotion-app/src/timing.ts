/*
 * Maps a Web Story's pages to per-page video durations.
 *
 * Each page holds for at least MIN_PAGE_MS. If a page's animations run longer
 * than that, we extend the hold to the end of the last animation plus a short
 * tail so the final keyframe is visible before the cut.
 */
export const FPS = 30;
const MIN_PAGE_MS = 5000;
const TAIL_MS = 1000;

interface StoryAnimation {
  duration?: number;
  delay?: number;
}

interface StoryPage {
  animations?: StoryAnimation[];
}

export function getPageDurationMs(page: StoryPage): number {
  const animations = page.animations ?? [];
  const animEnd = animations.reduce(
    (max, { duration = 0, delay = 0 }) => Math.max(max, delay + duration),
    0
  );
  return Math.max(MIN_PAGE_MS, animEnd > 0 ? animEnd + TAIL_MS : 0);
}

export function computePageFrames(pages: StoryPage[], fps = FPS): number[] {
  return pages.map((page) =>
    Math.max(1, Math.round((getPageDurationMs(page) / 1000) * fps))
  );
}
