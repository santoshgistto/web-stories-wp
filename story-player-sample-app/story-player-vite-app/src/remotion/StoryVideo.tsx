/*
 * NOTE: mirrors story-remotion-app/src/StoryVideo.tsx (the canonical render
 * pipeline used by the render server + Studio). Kept as a local copy so the
 * in-browser <Player> preview resolves THIS app's React/remotion. Keep in sync.
 *
 * Lays the story's pages out on the timeline: one Series.Sequence per page,
 * each as long as that page's computed hold (see timing.ts). Within a sequence
 * StoryPage reads the local frame and seeks the page's animations.
 */
import { Series } from 'remotion';
import type { Page } from '@googleforcreators/elements';
import { StoryPage } from './StoryPage';

export interface StoryVideoProps {
  pages: Page[];
  perPageFrames: number[];
  pageWidth: number;
}

export function StoryVideo({
  pages,
  perPageFrames,
  pageWidth,
}: StoryVideoProps) {
  return (
    <Series>
      {pages.map((page, index) => (
        <Series.Sequence
          key={page.id ?? index}
          durationInFrames={perPageFrames[index]}
        >
          <StoryPage page={page} width={pageWidth} />
        </Series.Sequence>
      ))}
    </Series>
  );
}
