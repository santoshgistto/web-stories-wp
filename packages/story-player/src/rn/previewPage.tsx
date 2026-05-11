/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 */

import { View } from 'react-native-web';
import type { Page } from '@googleforcreators/elements';

import DisplayElementRN from './displayElement';
import { rgbToStyle } from './utils';
import type { RNPageSize } from './types';

interface Props {
  page: Page;
  pageSize: RNPageSize;
}

/**
 * Render a single story page using RN primitives. Iterates elements in
 * source order (background first, then layered content). Animations
 * aren't plumbed in yet — page renders as a static snapshot at its end
 * state.
 */
export default function PreviewPageRN({ page, pageSize }: Props) {
  return (
    <View
      style={{
        width: pageSize.width,
        height: pageSize.height,
        backgroundColor: rgbToStyle(page.backgroundColor),
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {page.elements.map((element) => (
        <DisplayElementRN
          key={element.id}
          element={element}
          pageSize={pageSize}
        />
      ))}
    </View>
  );
}
