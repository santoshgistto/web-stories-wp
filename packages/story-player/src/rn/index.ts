/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * React-Native-Web renderer for Web Stories. Parallel to ../preview
 * (DOM + styled-components), this uses RN-Web primitives so the same
 * story JSON renders through RN's View/Image/Pressable. Imports are
 * direct from `react-native-web` for now; switching to cross-platform
 * `react-native` (with a per-platform alias) is a follow-up.
 *
 * Status — element renderers:
 *   ✅ image
 *   ⬜ text   (need RN HTML parsing for `content`)
 *   ⬜ video  (RN <Video> via react-native-video / expo-av)
 *   ⬜ shape  (View with backgroundColor; mask shapes need a clip)
 *   ⬜ sticker / gif / product / audioSticker
 *   ⬜ animations (need react-native-reanimated)
 *   ⬜ masks (need a clip primitive)
 */

export { default as StoryPlayerRN } from './storyPlayer';
export { default as PreviewPageRN } from './previewPage';
export { default as DisplayElementRN } from './displayElement';
export { default as ImageRN } from './elements/image';

export type { RNPageSize, RNBox } from './types';
export type { StoryPlayerRNProps } from './storyPlayer';
