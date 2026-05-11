"use client";

import dynamic from "next/dynamic";
import { ThemeProvider } from "styled-components";
import { theme } from "@googleforcreators/design-system";

import storyData from "./story.json";

// Story-player and its transitive deps (rich-text → getValidHTML) call
// `document.createElement` at module-init time, which crashes during SSR
// even though this page is marked "use client" (the client component is
// still pre-rendered server-side for the initial HTML). Loading via
// `dynamic` with `ssr: false` defers all of that to the browser.
const StoryPlayer = dynamic(
  () =>
    import("@googleforcreators/story-player").then(({ StoryPlayer }) => ({
      default: StoryPlayer,
    })),
  { ssr: false }
);

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-8">
        <StoryPlayer pages={storyData.pages as never} />
      </main>
    </ThemeProvider>
  );
}
