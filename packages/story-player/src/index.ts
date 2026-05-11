/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 */

import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

// Auto-register every built-in element type on package import. Stories
// reference elements by type name (text, image, video, shape, sticker,
// product, etc.) and rendering looks them up via getDefinitionForType. In
// the editor this registration happens during editor bootstrap; for a
// standalone player we do it here so consumers don't have to.
// element-library's `elementTypes` is a discriminated union TypeScript
// can't unify with `registerElementType`'s generic — cast at the boundary.
elementTypes.forEach((definition) =>
  registerElementType(definition as never)
);

export { default as StoryPlayer } from './storyPlayer';
export { PreviewPage, PreviewErrorBoundary } from './preview';
export { applyTemplate, findPlaceholders } from './applyTemplate';
export type { StoryPlayerProps, PageSize } from './types';
export type { PreviewPageSize } from './preview';
export type {
  TemplateSubstitutions,
  PlaceholderInfo,
} from './applyTemplate';
