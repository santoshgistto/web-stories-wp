import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@googleforcreators/design-system'
import {
  StoryPlayer,
  StoryPlayerRN,
  applyTemplate,
  findPlaceholders,
} from '@googleforcreators/story-player'
import storyData from './story2.json'
import { TEMPLATE_PAGES, SAMPLE_USER_PHOTOS } from './templateData'

type Demo = 'fullStory' | 'template' | 'rn'

function App() {
  const [demo, setDemo] = useState<Demo>('template')

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: '100vh',
          background: '#f1f1f1',
          padding: '32px 16px',
        }}
      >
        <Tabs current={demo} onChange={setDemo} />
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
          {demo === 'fullStory' && <FullStoryDemo />}
          {demo === 'template' && <TemplateDemo />}
          {demo === 'rn' && <RNDemo />}
        </div>
      </div>
    </ThemeProvider>
  )
}

function Tabs({ current, onChange }: { current: Demo; onChange: (d: Demo) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
      <TabButton active={current === 'template'} onClick={() => onChange('template')}>
        applyTemplate (memory templating)
      </TabButton>
      <TabButton active={current === 'fullStory'} onClick={() => onChange('fullStory')}>
        Full story (from story.json)
      </TabButton>
      <TabButton active={current === 'rn'} onClick={() => onChange('rn')}>
        RN-Web player (image only)
      </TabButton>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: active ? '#0c66e4' : '#fff',
        color: active ? '#fff' : '#333',
        border: '1px solid #ccc',
        borderRadius: 4,
        cursor: 'pointer',
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  )
}

function FullStoryDemo() {
  return <StoryPlayer pages={storyData.pages as never} />
}

// Pages built with only image elements — sized in Web Stories' coordinate
// space (PAGE_WIDTH × PAGE_HEIGHT). The RN renderer rescales to the
// actual on-screen page size at render time.
const RN_SAMPLE_PAGES = [
  {
    id: 'rn-page-1',
    type: 'page',
    backgroundColor: { color: { r: 30, g: 30, b: 40 } },
    animations: [],
    elements: [
      {
        id: 'bg',
        type: 'shape',
        isBackground: true,
        isDefaultBackground: true,
        x: 1, y: 1, width: 1, height: 1,
        backgroundColor: { color: { r: 30, g: 30, b: 40 } },
        mask: { type: 'rectangle' },
        opacity: 100, rotationAngle: 0,
        flip: { vertical: false, horizontal: false },
        lockAspectRatio: true,
      },
      {
        id: 'photo-1',
        type: 'image',
        x: 30, y: 80, width: 350, height: 460,
        opacity: 100, rotationAngle: -1,
        flip: { vertical: false, horizontal: false },
        lockAspectRatio: true,
        scale: 100, focalX: 50, focalY: 50,
        mask: { type: 'rectangle' },
        resource: {
          type: 'image',
          mimeType: 'image/jpeg',
          src: 'https://picsum.photos/id/1015/350/460',
          width: 350, height: 460,
          alt: 'Forest path',
        },
      },
    ],
  },
  {
    id: 'rn-page-2',
    type: 'page',
    backgroundColor: { color: { r: 30, g: 30, b: 40 } },
    animations: [],
    elements: [
      {
        id: 'bg',
        type: 'shape',
        isBackground: true,
        isDefaultBackground: true,
        x: 1, y: 1, width: 1, height: 1,
        backgroundColor: { color: { r: 30, g: 30, b: 40 } },
        mask: { type: 'rectangle' },
        opacity: 100, rotationAngle: 0,
        flip: { vertical: false, horizontal: false },
        lockAspectRatio: true,
      },
      {
        id: 'photo-2',
        type: 'image',
        x: 30, y: 80, width: 350, height: 460,
        opacity: 100, rotationAngle: 1,
        flip: { vertical: false, horizontal: false },
        lockAspectRatio: true,
        scale: 100, focalX: 50, focalY: 50,
        mask: { type: 'rectangle' },
        resource: {
          type: 'image',
          mimeType: 'image/jpeg',
          src: 'https://picsum.photos/id/1018/350/460',
          width: 350, height: 460,
          alt: 'Beach sunset',
        },
      },
    ],
  },
]

function RNDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 460 }}>
      <pre
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          padding: '10px 14px',
          marginBottom: 16,
          background: '#f4f4f4',
          border: '1px solid #ddd',
          borderRadius: 4,
          color: '#333',
          maxWidth: 380,
        }}
      >
        Rendered with React-Native-Web primitives (View, Image, Pressable).
        Tap left side ↔ prev, right side ↔ next. Auto-advance: 5s.
        Other element types render dashed red boxes (text, shapes, animations not implemented yet).
      </pre>
      <StoryPlayerRN
        pages={RN_SAMPLE_PAGES as never}
        width={333}
        autoAdvance
        pageDurationMs={5000}
      />
    </div>
  )
}

function TemplateDemo() {
  // -1 = show the raw template (placeholder visible).
  // 0..N = show template with the Nth sample photo applied.
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const placeholders = findPlaceholders(TEMPLATE_PAGES as never)

  const renderedPages =
    selectedIndex === -1
      ? (TEMPLATE_PAGES as never)
      : (applyTemplate(TEMPLATE_PAGES as never, {
          memoryPhoto: SAMPLE_USER_PHOTOS[selectedIndex].resource as never,
        }) as never)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 460 }}>
      <pre
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          padding: '10px 14px',
          marginBottom: 16,
          background: '#f4f4f4',
          border: '1px solid #ddd',
          borderRadius: 4,
          color: '#333',
          whiteSpace: 'pre-wrap',
          width: '100%',
        }}
      >
        <strong>findPlaceholders(pages)</strong> →
        {'\n'}
        {placeholders
          .map(
            (p) =>
              `• ${p.placeholderId} — page ${p.pageId}, element ${p.elementId} (${p.elementType})`
          )
          .join('\n')}
      </pre>

      <StoryPlayer pages={renderedPages} autoPlay={false} showControls={false} />

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
        }}
      >
        <ApplyButton
          active={selectedIndex === -1}
          onClick={() => setSelectedIndex(-1)}
        >
          Show template
        </ApplyButton>
        {SAMPLE_USER_PHOTOS.map((photo, i) => (
          <ApplyButton
            key={photo.label}
            active={selectedIndex === i}
            onClick={() => setSelectedIndex(i)}
          >
            Apply: {photo.label}
          </ApplyButton>
        ))}
      </div>
    </div>
  )
}

function ApplyButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        background: active ? '#0c66e4' : '#5a5a5a',
        color: 'white',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      {children}
    </button>
  )
}

export default App
