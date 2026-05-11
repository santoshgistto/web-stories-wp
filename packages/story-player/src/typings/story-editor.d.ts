/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Minimal ambient declarations for the pieces of @googleforcreators/story-editor
 * we consume. The story-editor package only emits .d.ts for a narrow subset of
 * its source, so PreviewPage has no upstream type. Replace this shim once
 * PreviewPage is either ported into this package or properly typed upstream.
 */

declare module '@googleforcreators/story-editor' {
  import type { ComponentType, Ref } from 'react';
  import type { Page } from '@googleforcreators/elements';

  export interface PreviewPagePageSize {
    width: number;
    height: number;
    containerHeight: number;
  }

  export interface PreviewPageProps {
    page: Page;
    pageSize: PreviewPagePageSize;
    animationState?: string;
    onAnimationComplete?: () => void;
    ref?: Ref<HTMLDivElement>;
  }

  export const PreviewPage: ComponentType<PreviewPageProps>;
}
