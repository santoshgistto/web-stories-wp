/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Player-side equivalent of the editor's `useLoadFontFiles`. The editor wires
 * font loading through `useFont` (a React context backed by the editor's app
 * state); a static player has no such context, so we expose a plain function
 * with the same `(fonts: FontConfig[]) => Promise<unknown>` shape that
 * element-library's TextDisplay expects.
 *
 * Without this, the no-op stub previously used here meant Google Fonts CSS was
 * never injected — text rendered with whatever default font the browser picked,
 * which also threw off measured dimensions.
 */
import {
  ensureFontLoaded,
  loadInlineStylesheet,
  loadStylesheet,
} from '@googleforcreators/dom';
import { getFontCSS, getGoogleFontURL } from '@googleforcreators/fonts';
import {
  FontService,
  type FontData,
  type FontStyle,
  type FontWeight,
} from '@googleforcreators/elements';

interface FontConfig {
  font: FontData;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
  content: string;
}

// Mirrors the editor's slug rule: lowercase, hyphens for spaces. Keeping the
// id stable across calls is what prevents duplicate <link>/<style> injection.
function fontSlug(family: string) {
  return family
    .toLowerCase()
    .replace(/[\s./_]/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function loadFontOnce(font: FontData) {
  const elementId = `web-stories-${fontSlug(font.family)}-font-css`;
  if (typeof document === 'undefined' || document.getElementById(elementId)) {
    return;
  }

  switch (font.service) {
    case FontService.GoogleFonts:
      await loadStylesheet(
        getGoogleFontURL([{ family: font.family, variants: font.variants }], 'auto'),
        elementId
      );
      return;
    case FontService.Custom: {
      const css = getFontCSS(font.family, font.url);
      if (css) {
        loadInlineStylesheet(elementId, css);
      }
      return;
    }
    default:
      return;
  }
}

export function maybeEnqueueFontStyle(fonts: FontConfig[]) {
  return Promise.allSettled(
    fonts.map(async ({ font, fontStyle, fontWeight, content }) => {
      const { family, service } = font;
      if (!family || service === FontService.System) {
        return null;
      }
      const fontFaceSet = `${fontStyle || ''} ${fontWeight || ''} 0 '${family}'`.trim();
      await loadFontOnce(font);
      return ensureFontLoaded(fontFaceSet, content);
    })
  );
}
