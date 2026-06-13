/*
 * Registers the "StoryVideo" composition. Page durations are derived from the
 * story's animations at module load, so the timeline length is correct in both
 * the Studio and CLI renders without a calculateMetadata round-trip.
 */
import { Composition } from 'remotion';
import type { Page } from '@googleforcreators/elements';
import { StoryVideo } from './StoryVideo';
import { computePageFrames, FPS } from './timing';
import storyJson from './story.json';

const PAGE_WIDTH = 720; // 9:16 -> 720 x 1280
const PAGE_HEIGHT = Math.round(PAGE_WIDTH / (9 / 16));

const pages = storyJson.pages as unknown as Page[];
const perPageFrames = computePageFrames(storyJson.pages);
const totalFrames = perPageFrames.reduce((sum, n) => sum + n, 0);

export function RemotionRoot() {
  return (
    <Composition
      id="StoryVideo"
      component={StoryVideo}
      durationInFrames={totalFrames}
      fps={FPS}
      width={PAGE_WIDTH}
      height={PAGE_HEIGHT}
      defaultProps={{ pages, perPageFrames, pageWidth: PAGE_WIDTH }}
    />
  );
}
