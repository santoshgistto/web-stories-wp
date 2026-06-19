/*
 * Registers the "StoryVideo" composition.
 *
 * Pages come from Remotion input props (so the render server can pass an
 * arbitrary story posted from the editor), falling back to the bundled
 * story.json for Studio/CLI use. Page durations — and therefore the timeline
 * length — are derived from the pages' animations in calculateMetadata, so the
 * video length adapts to whatever story is rendered.
 */
import { Composition } from 'remotion';
import type { Page } from '@googleforcreators/elements';
import { StoryVideo } from './StoryVideo';
import { computePageFrames, FPS } from './timing';
import storyJson from './story.json';

const PAGE_WIDTH = 720; // 9:16 -> 720 x 1280
const PAGE_HEIGHT = Math.round(PAGE_WIDTH / (9 / 16));

const defaultPages = storyJson.pages as unknown as Page[];
const defaultPerPageFrames = computePageFrames(storyJson.pages);

export function RemotionRoot() {
  return (
    <Composition
      id="StoryVideo"
      component={StoryVideo}
      fps={FPS}
      width={PAGE_WIDTH}
      height={PAGE_HEIGHT}
      durationInFrames={defaultPerPageFrames.reduce((s, n) => s + n, 0) || 1}
      defaultProps={{
        pages: defaultPages,
        perPageFrames: defaultPerPageFrames,
        pageWidth: PAGE_WIDTH,
      }}
      calculateMetadata={({ props }) => {
        const perPageFrames = computePageFrames(props.pages);
        return {
          durationInFrames: perPageFrames.reduce((s, n) => s + n, 0) || 1,
          props: { ...props, perPageFrames },
        };
      }}
    />
  );
}
