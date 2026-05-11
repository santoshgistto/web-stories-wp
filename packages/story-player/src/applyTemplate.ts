/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Template-substitution helpers for memory-style playback. A designer
 * authors a "template" — a Web Story whose media elements (photo / video /
 * gif) are tagged with a `placeholderId`. At runtime, applyTemplate() walks
 * the template and swaps each tagged element's resource for one supplied
 * by the caller (e.g., a photo from the user's library).
 *
 * Convention: designers tag a media element with `placeholderId: "<key>"`
 * either in the editor (a future custom panel) or via post-export tooling.
 * The element keeps its size, position, animations, and mask — only the
 * underlying media is replaced.
 */

import { elementIs } from '@googleforcreators/elements';
import type { Element, Page } from '@googleforcreators/elements';
import type { Resource } from '@googleforcreators/media';

/**
 * Type-augmentation: any element may carry an optional `placeholderId`. The
 * field is read at runtime but not part of the upstream Element type yet.
 */
type ElementWithPlaceholder = Element & { placeholderId?: string };

/**
 * Map from placeholderId → user-supplied resource. Order doesn't matter.
 * Placeholder ids missing from this map are left as-is (template's
 * placeholder media stays visible).
 */
export type TemplateSubstitutions = Record<string, Resource>;

/**
 * Information about a single placeholder slot in a template — useful for
 * the consumer to know which substitutions a template expects.
 */
export interface PlaceholderInfo {
  placeholderId: string;
  pageId: string;
  elementId: string;
  elementType: string;
}

/**
 * Apply user media to a template. Returns a new page array; the input is
 * not mutated. Only media elements (image / video / gif) tagged with a
 * `placeholderId` are eligible for substitution; non-media elements with
 * the tag are ignored (likely a tagging mistake — surface during dev).
 */
export function applyTemplate(
  pages: Page[],
  substitutions: TemplateSubstitutions
): Page[] {
  return pages.map((page) => ({
    ...page,
    elements: page.elements.map((element) =>
      substituteElement(element, substitutions)
    ),
  }));
}

/**
 * Return every placeholder slot defined across a template. Use this to
 * drive UI ("pick 4 photos for the Flashback template") or to validate
 * that the consumer-provided substitutions cover every slot.
 */
export function findPlaceholders(pages: Page[]): PlaceholderInfo[] {
  const placeholders: PlaceholderInfo[] = [];
  for (const page of pages) {
    for (const element of page.elements) {
      const placeholderId = (element as ElementWithPlaceholder).placeholderId;
      if (!placeholderId) {
        continue;
      }
      placeholders.push({
        placeholderId,
        pageId: page.id,
        elementId: element.id,
        elementType: element.type,
      });
    }
  }
  return placeholders;
}

function substituteElement(
  element: Element,
  substitutions: TemplateSubstitutions
): Element {
  const placeholderId = (element as ElementWithPlaceholder).placeholderId;
  if (!placeholderId) {
    return element;
  }
  const resource = substitutions[placeholderId];
  if (!resource) {
    // Substitution not provided — leave the template's placeholder media.
    return element;
  }
  if (!elementIs.media(element)) {
    // Only media elements carry a `resource` field. Tagging a text element
    // (etc.) with placeholderId is a designer error — silently ignore so
    // the rest of the template still renders.
    return element;
  }
  // `elementIs.media` narrows to MediaElement at runtime, but the union
  // return type doesn't infer the spread cleanly — cast back to Element.
  return { ...element, resource } as Element;
}
