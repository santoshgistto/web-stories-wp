/*
 * Renders a single Web Story page for one Remotion frame.
 *
 * The story-player normally plays its WAAPI animations in real time. Here we
 * pass `currentTimeMs` derived from Remotion's frame clock, so PreviewPage
 * *seeks* every animation to that exact offset instead — making each rendered
 * frame deterministic.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThemeProvider } from 'styled-components';
import { theme } from '@googleforcreators/design-system';
import { PAGE_RATIO, FULLBLEED_RATIO, UnitsProvider } from '@googleforcreators/units';
import { TransformProvider } from '@googleforcreators/transform';
import { PreviewPage } from '@googleforcreators/story-player';
import type { Page } from '@googleforcreators/elements';
import { getPageImageUrls, useImagePreload } from './useImagePreload';

export function StoryPage({ page, width }: { page: Page; width: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // useCurrentFrame() is relative to this page's Series.Sequence, so 0 is the
  // moment the page appears — exactly the animation start time.
  const currentTimeMs = (frame / fps) * 1000;

  // Hold the render until this page's (remote) images are decoded.
  useImagePreload(getPageImageUrls(page));

  const pageSize = {
    width,
    height: Math.round(width / PAGE_RATIO),
    containerHeight: Math.round(width / FULLBLEED_RATIO),
  };

  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      <ThemeProvider theme={theme}>
        <UnitsProvider
          pageSize={{ width: pageSize.width, height: pageSize.height }}
        >
          <TransformProvider>
            <PreviewPage
              page={page}
              pageSize={pageSize}
              currentTimeMs={currentTimeMs}
            />
          </TransformProvider>
        </UnitsProvider>
      </ThemeProvider>
    </AbsoluteFill>
  );
}
