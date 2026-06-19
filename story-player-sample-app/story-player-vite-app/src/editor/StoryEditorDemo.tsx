import { StoryEditor, InterfaceSkeleton } from '@googleforcreators/story-editor'
import { EditorHeader } from './EditorHeader'
import storyJson from '../story2.json'

// Element types are auto-registered when @googleforcreators/story-player is
// imported (App.tsx), and the editor shares the same element registry, so we
// don't register again here.

// Minimal integration layer: a no-op save is enough to design + export.
const apiCallbacks = {
  saveStoryById: () => Promise.resolve({}),
}

// Seed the editor with the sample story so it opens with editable, animated
// content (useLoadStory hydrates pages from story.storyData.pages). Replace
// with `{ story: {} }` to start from a blank page.
const initialEdits = {
  story: {
    storyData: {
      version: storyJson.version,
      pages: storyJson.pages,
    },
  },
}

export function StoryEditorDemo({ onBack }: { onBack?: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#fff',
      }}
    >
      <StoryEditor config={{ apiCallbacks }} initialEdits={initialEdits}>
        <InterfaceSkeleton header={<EditorHeader onBack={onBack} />} />
      </StoryEditor>
    </div>
  )
}
