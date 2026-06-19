import { useState, useCallback, Suspense, lazy } from 'react'
import { useStory } from '@googleforcreators/story-editor'

// Lazy so @remotion/player (and the composition) only load when the user opens
// the preview — keeping them out of the editor's critical import path.
const StoryPlayerPreview = lazy(() =>
  import('./StoryPlayerPreview').then((m) => ({ default: m.StoryPlayerPreview }))
)

// Where the Remotion render server (story-remotion-app `npm run serve`) listens.
const RENDER_SERVER_URL = 'http://localhost:4000'
// Must match the render composition's page width (9:16 -> 720 x 1280).
const PAGE_WIDTH = 720

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function EditorHeader({ onBack }: { onBack?: () => void }) {
  // Select narrowly so this header only re-renders when pages/story change.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pages = useStory(({ state }: any) => state.pages)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const story = useStory(({ state }: any) => state.story)

  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const exportJSON = useCallback(() => {
    const doc = { version: 1, story, pages }
    triggerDownload(
      new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' }),
      'story.json'
    )
    setStatus('Downloaded story.json ✓')
  }, [pages, story])

  const exportVideo = useCallback(async () => {
    if (!pages?.length) {
      setStatus('Add a page before exporting a video.')
      return
    }
    setBusy(true)
    setStatus('Rendering video on the server — this can take a little while…')
    try {
      const res = await fetch(`${RENDER_SERVER_URL}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pages, pageWidth: PAGE_WIDTH }),
      })
      if (!res.ok) {
        throw new Error(`Render failed (${res.status}): ${await res.text()}`)
      }
      triggerDownload(await res.blob(), 'story.mp4')
      setStatus('Downloaded story.mp4 ✓')
    } catch (err) {
      setStatus(
        `${(err as Error).message}. Is the render server running? ` +
          `(cd story-remotion-app && npm run serve)`
      )
    } finally {
      setBusy(false)
    }
  }, [pages])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 48,
        padding: '0 16px',
        background: '#1a1a1a',
        color: '#fff',
        borderBottom: '1px solid #333',
      }}
    >
      {onBack && (
        <button onClick={onBack} style={ghostBtn}>
          ← Demos
        </button>
      )}
      <strong style={{ fontSize: 14, marginRight: 'auto' }}>
        Story Editor — {pages?.length ?? 0} page
        {(pages?.length ?? 0) === 1 ? '' : 's'}
      </strong>
      <span style={{ fontSize: 12, opacity: 0.8, maxWidth: 320 }}>{status}</span>
      <button
        onClick={() => setPreviewOpen(true)}
        style={secondaryBtn}
        disabled={busy || !pages?.length}
      >
        ▶ Preview
      </button>
      <button onClick={exportJSON} style={secondaryBtn} disabled={busy}>
        Export JSON
      </button>
      <button onClick={exportVideo} style={primaryBtn} disabled={busy}>
        {busy ? 'Rendering…' : 'Export Video'}
      </button>

      {previewOpen && (
        <div
          onClick={() => setPreviewOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          {/* Stop propagation so clicks on the player don't close the modal. */}
          <div onClick={(e) => e.stopPropagation()}>
            <Suspense fallback={<p style={{ color: '#fff' }}>Loading preview…</p>}>
              <StoryPlayerPreview pages={pages} />
            </Suspense>
          </div>
          <button onClick={() => setPreviewOpen(false)} style={secondaryBtn}>
            Close preview
          </button>
        </div>
      )}
    </div>
  )
}

const baseBtn: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: 4,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  border: 'none',
}
const primaryBtn: React.CSSProperties = {
  ...baseBtn,
  background: '#0c66e4',
  color: '#fff',
}
const secondaryBtn: React.CSSProperties = {
  ...baseBtn,
  background: '#fff',
  color: '#1a1a1a',
}
const ghostBtn: React.CSSProperties = {
  ...baseBtn,
  background: 'transparent',
  color: '#fff',
  border: '1px solid #555',
}
