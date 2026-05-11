import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@googleforcreators/design-system'
import {
  StoryPlayer,
  applyTemplate,
  findPlaceholders,
} from '@googleforcreators/story-player'
import storyData from './story.json'
import { TEMPLATE_PAGES, SAMPLE_USER_PHOTOS } from './templateData'

type Demo = 'fullStory' | 'template'

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
          {demo === 'fullStory' ? <FullStoryDemo /> : <TemplateDemo />}
        </div>
      </div>
    </ThemeProvider>
  )
}

function Tabs({ current, onChange }: { current: Demo; onChange: (d: Demo) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
      <TabButton active={current === 'template'} onClick={() => onChange('template')}>
        applyTemplate (memory templating)
      </TabButton>
      <TabButton active={current === 'fullStory'} onClick={() => onChange('fullStory')}>
        Full story (from story.json)
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
