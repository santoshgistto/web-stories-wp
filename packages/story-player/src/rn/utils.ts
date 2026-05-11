/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 */

import { PAGE_WIDTH, PAGE_HEIGHT } from '@googleforcreators/units';
import type { Element } from '@googleforcreators/elements';

import type { RNBox, RNPageSize } from './types';

/**
 * Web Stories coordinates are stored in a fixed PAGE_WIDTH × PAGE_HEIGHT
 * data space (412 × 618 at the time of writing). RN's layout system uses
 * actual pixels, so each element's box has to be scaled to the rendered
 * page size before we hand it to RN's style system.
 */
export function computeBox(
  element: Pick<Element, 'x' | 'y' | 'width' | 'height'>,
  pageSize: RNPageSize
): RNBox {
  const { scaleX, scaleY } = getRenderScales(pageSize);
  return {
    x: element.x * scaleX,
    y: element.y * scaleY,
    width: element.width * scaleX,
    height: element.height * scaleY,
  };
}

/**
 * Per-axis data→render scale factors. Exposed so element renderers that do
 * extra math in data space (crop offsets, border widths) can scale the
 * result themselves instead of re-deriving it.
 */
export function getRenderScales(pageSize: RNPageSize): {
  scaleX: number;
  scaleY: number;
} {
  return {
    scaleX: pageSize.width / PAGE_WIDTH,
    scaleY: pageSize.height / PAGE_HEIGHT,
  };
}

/**
 * Background elements ignore their stored x/y/width/height and fill the
 * page. We use page (not fullbleed) here since the RN player has no
 * danger-zone concept yet — the rendered View *is* the visible page.
 */
export function getEffectiveBox(
  element: Pick<Element, 'x' | 'y' | 'width' | 'height'> & {
    isBackground?: boolean;
  }
): { x: number; y: number; width: number; height: number } {
  if (element.isBackground) {
    return { x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT };
  }
  return {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
  };
}

/**
 * Web Stories background colors come as a Pattern (solid color, gradient,
 * or image). For RN v1 we only handle solid colors — extract { r, g, b, a }
 * from any pattern-shaped object that has a `.color` field. Anything else
 * (gradients, image patterns) falls back to white. Gradients via a Surface
 * primitive is a future addition.
 */
export function rgbToStyle(bg: unknown): string {
  if (!bg || typeof bg !== 'object') {
    return '#ffffff';
  }
  const color = (bg as { color?: { r: number; g: number; b: number; a?: number } })
    .color;
  if (!color) {
    return '#ffffff';
  }
  const { r, g, b, a = 1 } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
