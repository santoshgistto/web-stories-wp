/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native-web';
import type { Page } from '@googleforcreators/elements';

import PreviewPageRN from './previewPage';
import type { RNPageSize } from './types';

const DEFAULT_WIDTH = 333;
// Match the editor's 9:16 fullbleed aspect ratio.
const ASPECT_W = 9;
const ASPECT_H = 16;

export interface StoryPlayerRNProps {
  pages: Page[];
  width?: number;
  autoAdvance?: boolean;
  pageDurationMs?: number;
  initialPageIndex?: number;
  onPageChange?: (index: number) => void;
  onFinish?: () => void;
}

/**
 * Multi-page Web Story player using RN primitives. Two tap zones overlay
 * the page — left 30% goes back, right 70% advances. Auto-advance is on
 * by default; pageDurationMs sets the per-page time. No swipe gesture
 * yet (would use react-native-gesture-handler).
 */
export default function StoryPlayerRN({
  pages,
  width = DEFAULT_WIDTH,
  autoAdvance = true,
  pageDurationMs = 5000,
  initialPageIndex = 0,
  onPageChange,
  onFinish,
}: StoryPlayerRNProps) {
  const [pageIndex, setPageIndex] = useState(initialPageIndex);

  const pageSize: RNPageSize = {
    width,
    height: Math.round((width * ASPECT_H) / ASPECT_W),
  };

  const next = useCallback(() => {
    setPageIndex((i) => {
      const target = i + 1;
      if (target >= pages.length) {
        onFinish?.();
        return i;
      }
      onPageChange?.(target);
      return target;
    });
  }, [pages.length, onFinish, onPageChange]);

  const prev = useCallback(() => {
    setPageIndex((i) => {
      const target = Math.max(i - 1, 0);
      if (target !== i) {
        onPageChange?.(target);
      }
      return target;
    });
  }, [onPageChange]);

  useEffect(() => {
    if (!autoAdvance) {
      return undefined;
    }
    const timer = setTimeout(next, pageDurationMs);
    return () => clearTimeout(timer);
  }, [pageIndex, autoAdvance, pageDurationMs, next]);

  const currentPage = pages[pageIndex];
  if (!currentPage) {
    return null;
  }

  return (
    <View
      style={{
        width: pageSize.width,
        height: pageSize.height,
        position: 'relative',
      }}
    >
      <PreviewPageRN page={currentPage} pageSize={pageSize} />

      <Pressable
        onPress={prev}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '30%',
          backgroundColor:'transperent'
        }}
      />
      <Pressable
        onPress={next}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '30%',
          backgroundColor:'transperent'
        }}
      />
    </View>
  );
}
