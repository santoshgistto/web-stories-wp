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
import type { Element, ImageElement } from '@googleforcreators/elements';

import { computeBox } from './utils';
import type { RNPageSize } from './types';
import ImageRN from './elements/image';

interface Props {
  element: Element;
  pageSize: RNPageSize;
}

/**
 * Dispatch a single page element to the correct RN renderer based on
 * `element.type`. Only `image` is implemented for now. Unsupported types
 * render a dashed placeholder box in dev so the layout is visible (helps
 * see which types still need a renderer); they render nothing in
 * production.
 *
 * `elementIs` doesn't expose a per-type guard for image — narrow via the
 * discriminator field directly.
 */
export default function DisplayElementRN({ element, pageSize }: Props) {
  if (element.type === 'image') {
    return <ImageRN element={element as ImageElement} pageSize={pageSize} />;
  }

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    const box = computeBox(element, pageSize);
    return (
      <View
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          borderWidth: 1,
          borderColor: '#ff0000',
          borderStyle: 'dashed',
        }}
      />
    );
  }

  return null;
}
