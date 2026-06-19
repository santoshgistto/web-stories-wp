import { useMemo } from 'react'
import { Player } from '@remotion/player'
// The composition mirrors story-remotion-app/src (the render server/Studio use
// the same components), so the in-browser preview matches the exported MP4.
// It's kept as a local copy rather than imported across apps so it resolves
// THIS app's React/remotion — a cross-app import drags in the remotion-app's
// React 18 and splits the remotion singleton, breaking the Player's timeline.
import { StoryVideo } from '../remotion/StoryVideo'
import { computePageFrames, FPS } from '../remotion/timing'

const PAGE_WIDTH = 720
const PAGE_HEIGHT = Math.round(PAGE_WIDTH / (9 / 16)) // 1280

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StoryPlayerPreview({ pages }: { pages: any[] }) {
  const perPageFrames = useMemo(() => computePageFrames(pages), [pages])
  const durationInFrames = useMemo(
    () => perPageFrames.reduce((sum, n) => sum + n, 0) || 1,
    [perPageFrames]
  )

  if (!pages?.length) {
    return <p style={{ color: '#aaa' }}>Add a page to preview.</p>
  }

  return (
    <Player
      component={StoryVideo as never}
      inputProps={{ pages, perPageFrames, pageWidth: PAGE_WIDTH }}
      durationInFrames={durationInFrames}
      fps={FPS}
      compositionWidth={PAGE_WIDTH}
      compositionHeight={PAGE_HEIGHT}
      style={{ width: 360, height: 640, borderRadius: 8, overflow: 'hidden' }}
      controls
      autoPlay
      loop
    />
  )
}
