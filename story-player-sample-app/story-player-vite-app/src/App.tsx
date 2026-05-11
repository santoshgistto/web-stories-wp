import { ThemeProvider } from 'styled-components'
import { theme } from '@googleforcreators/design-system'
import { StoryPlayer } from '@googleforcreators/story-player'
import storyData from './story.json'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f1f1f1',
        }}
      >
        <StoryPlayer pages={storyData.pages as never} />
      </div>
    </ThemeProvider>
  )
}

export default App
