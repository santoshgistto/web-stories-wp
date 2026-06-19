/*
 * The story-player renders plain <img> tags, which Remotion does not wait for
 * before capturing a frame. Remote images (some multiple thousand pixels wide)
 * therefore aren't loaded for a page's first frames, leaving them blank.
 *
 * This hook collects every image URL on a page and holds the render (via
 * delayRender) until the browser has decoded them, so the page's first frame
 * already shows its imagery. Decoded images stay in the browser cache, so the
 * actual <img> tags then paint immediately.
 */
import { useEffect, useState } from 'react';
import { delayRender, continueRender } from 'remotion';
import type { Page } from '@googleforcreators/elements';

export function getPageImageUrls(page: Page): string[] {
  const urls = new Set<string>();
  for (const element of page.elements ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resource = (element as any).resource;
    if (resource?.src) {
      urls.add(resource.src as string);
    }
    if (resource?.poster) {
      urls.add(resource.poster as string);
    }
  }
  return [...urls];
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // don't block the render on a broken URL
    img.src = url;
  });
}

export function useImagePreload(urls: string[]): void {
  // Call delayRender once per mount (a fresh handle per page sequence).
  const [handle] = useState(() =>
    delayRender('Preloading story images', { timeoutInMilliseconds: 60000 })
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all(urls.map(preloadImage)).then(() => {
      if (!cancelled) {
        continueRender(handle);
      }
    });
    return () => {
      cancelled = true;
    };
    // urls are stable for a given page; join to avoid array-identity churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle, urls.join('|')]);
}
