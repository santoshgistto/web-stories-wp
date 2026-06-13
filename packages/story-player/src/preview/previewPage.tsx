/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Ported from packages/story-editor/src/components/previewPage/previewPage.js
 *
 * A quick note about how height works with the 9:16 aspect ratio
 * (FULLBLEED_RATIO): the UnitsProvider that sizes page previews needs the 2:3
 * ratio, passed in as pageSize.height (the true page height). We also need a
 * 9:16 height that acts as the container so fullbleed elements can overflow —
 * that's pageSize.containerHeight wrapping PreviewSafeZone.
 */

import { useEffect, memo, forwardRef } from '@googleforcreators/react';
import styled, { StyleSheetManager } from 'styled-components';
import { generatePatternStyles } from '@googleforcreators/patterns';
import {
  AnimationProvider,
  useStoryAnimationContext,
  StoryAnimationState,
} from '@googleforcreators/animation';
import type { Page } from '@googleforcreators/elements';
import type { Ref } from 'react';

import PagePreviewElements from './previewPageElements';

export interface PreviewPageSize {
  width: number;
  height: number;
  containerHeight: number;
}

const FullBleedPreviewWrapper = styled.div<{
  pageSize: PreviewPageSize;
  background?: unknown;
}>`
  height: ${({ pageSize }) => `${pageSize.containerHeight}px`};
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  ${({ background }) => generatePatternStyles(background as never)};
`;

const PreviewSafeZone = styled.div<{ pageSize: PreviewPageSize }>`
  width: 100%;
  height: ${({ pageSize }) => `${pageSize.height}px`};
  overflow: visible;
  position: absolute;
  margin: 0;
`;

function PreviewPageAnimationController({
  animationState,
  currentTimeMs,
}: {
  animationState: string;
  currentTimeMs?: number;
}) {
  const WAAPIAnimationMethods = useStoryAnimationContext(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ actions }: any) => actions.WAAPIAnimationMethods
  );

  // Seek-driven mode: when an explicit time is supplied (e.g. an external
  // frame clock such as Remotion's), seek every WAAPI animation to that time
  // instead of letting them play in real time. Animations stay paused at the
  // requested offset, which makes rendering deterministic frame-by-frame.
  useEffect(() => {
    if (typeof currentTimeMs === 'number') {
      WAAPIAnimationMethods.setCurrentTime(currentTimeMs);
    }
  }, [currentTimeMs, WAAPIAnimationMethods]);

  useEffect(() => {
    if (typeof currentTimeMs === 'number') {
      return;
    }
    switch (animationState) {
      case StoryAnimationState.Playing:
        WAAPIAnimationMethods.play();
        return;
      case StoryAnimationState.Reset:
        WAAPIAnimationMethods.reset();
        return;
      case StoryAnimationState.Scrubbing:
      case StoryAnimationState.Paused:
        WAAPIAnimationMethods.pause();
        return;
    }
  }, [animationState, currentTimeMs, WAAPIAnimationMethods]);

  useEffect(
    () => () => WAAPIAnimationMethods.reset(),
    [WAAPIAnimationMethods]
  );

  return null;
}

const PreviewPageDisplay = memo(
  forwardRef(function PreviewPageDisplay(
    { page, pageSize }: { page: Page; pageSize: PreviewPageSize },
    ref: Ref<HTMLDivElement>
  ) {
    return (
      <FullBleedPreviewWrapper
        ref={ref}
        pageSize={pageSize}
        background={page.backgroundColor}
      >
        <PreviewSafeZone pageSize={pageSize}>
          <PagePreviewElements page={page} />
        </PreviewSafeZone>
      </FullBleedPreviewWrapper>
    );
  })
);

interface PreviewPageProps {
  page: Page;
  pageSize: PreviewPageSize;
  animationState?: string;
  // When provided, animations are seeked to this time (ms) rather than played
  // in real time — used to drive rendering from an external frame clock.
  currentTimeMs?: number;
  onAnimationComplete?: () => void;
}

const PreviewPage = forwardRef(function PreviewPage(
  {
    page,
    pageSize,
    animationState = StoryAnimationState.Reset,
    currentTimeMs,
    onAnimationComplete,
  }: PreviewPageProps,
  ref: Ref<HTMLDivElement>
) {
  // Forces LTR styling for the player. RTL-flipping isn't relevant for static
  // story previews and confuses the editor's Moveable-aware components.
  return (
    <StyleSheetManager stylisPlugins={[]}>
      <AnimationProvider
        animations={page.animations}
        elements={page.elements}
        onWAAPIFinish={onAnimationComplete}
      >
        <PreviewPageDisplay ref={ref} page={page} pageSize={pageSize} />
        <PreviewPageAnimationController
          animationState={animationState}
          currentTimeMs={currentTimeMs}
        />
      </AnimationProvider>
    </StyleSheetManager>
  );
});

export default PreviewPage;
