/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Ported from packages/story-editor/src/components/previewPage/previewPageElements.js
 */

import { memo } from '@googleforcreators/react';
import type { Page } from '@googleforcreators/elements';

import DisplayElement from './displayElement';

function PreviewPageElements({ page }: { page: Page }) {
  return (
    <>
      {page.elements.map((element) => (
        <DisplayElement
          previewMode
          key={element.id}
          element={element}
          isAnimatable
        />
      ))}
    </>
  );
}

export default memo(PreviewPageElements);
