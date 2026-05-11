/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 */

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from '@googleforcreators/react';
import { StoryAnimationState } from '@googleforcreators/animation';
import { PreviewPage } from '@googleforcreators/story-editor';
import {
  PAGE_RATIO,
  FULLBLEED_RATIO,
  UnitsProvider,
} from '@googleforcreators/units';
import { TransformProvider } from '@googleforcreators/transform';

import type { StoryPlayerProps, PageSize } from './types';
import {
  Container,
  StoryContainer,
  PageIndicator,
  PageDot,
  NavigationControls,
  NavButton,
} from './styled';

const DEFAULT_WIDTH = 333;
const DEFAULT_DURATION_MS = 5000;

function StoryPlayer({
  pages,
  width = DEFAULT_WIDTH,
  autoPlay: autoPlayProp = true,
  pageDurationMs = DEFAULT_DURATION_MS,
  showControls = true,
  initialPageIndex = 0,
  onPageChange,
  onFinish,
}: StoryPlayerProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPageIndex);
  const [animationState, setAnimationState] = useState<string>(
    StoryAnimationState.Playing
  );
  const [autoPlay, setAutoPlay] = useState(autoPlayProp);

  const pageSize: PageSize = useMemo(() => {
    const height = Math.round(width / PAGE_RATIO);
    const containerHeight = Math.round(width / FULLBLEED_RATIO);
    return { width, height, containerHeight };
  }, [width]);

  const currentPage = pages[currentPageIndex];

  const goToPage = useCallback(
    (index: number) => {
      setCurrentPageIndex(index);
      setAnimationState(StoryAnimationState.Reset);
      onPageChange?.(index);
    },
    [onPageChange]
  );

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < pages.length - 1) {
      goToPage(currentPageIndex + 1);
    } else {
      setAutoPlay(false);
      onFinish?.();
    }
  }, [currentPageIndex, pages.length, goToPage, onFinish]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      goToPage(currentPageIndex - 1);
    }
  }, [currentPageIndex, goToPage]);

  const play = useCallback(
    () => setAnimationState(StoryAnimationState.Playing),
    []
  );
  const pause = useCallback(
    () => setAnimationState(StoryAnimationState.Paused),
    []
  );
  const reset = useCallback(
    () => setAnimationState(StoryAnimationState.Reset),
    []
  );

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => {
      const next = !prev;
      setAnimationState(
        next ? StoryAnimationState.Playing : StoryAnimationState.Paused
      );
      return next;
    });
  }, []);

  useEffect(() => {
    setAnimationState(StoryAnimationState.Playing);
  }, [currentPageIndex]);

  useEffect(() => {
    if (!autoPlay) {
      return undefined;
    }
    const timer = setTimeout(goToNextPage, pageDurationMs);
    return () => clearTimeout(timer);
  }, [currentPageIndex, autoPlay, pageDurationMs, goToNextPage]);

  if (!currentPage) {
    return null;
  }

  return (
    <Container>
      <StoryContainer $width={pageSize.width} $height={pageSize.containerHeight}>
        <UnitsProvider pageSize={{ width: pageSize.width, height: pageSize.height }}>
          <TransformProvider>
            <PreviewPage
              page={currentPage}
              pageSize={pageSize}
              animationState={animationState}
            />
          </TransformProvider>
        </UnitsProvider>
      </StoryContainer>

      {showControls && (
        <>
          <PageIndicator>
            {pages.map((page, index) => (
              <PageDot key={page.id} $active={index === currentPageIndex} />
            ))}
          </PageIndicator>

          <NavigationControls>
            <NavButton onClick={goToPrevPage} disabled={currentPageIndex === 0}>
              Previous
            </NavButton>
            {animationState === StoryAnimationState.Playing ? (
              <NavButton onClick={pause}>Pause</NavButton>
            ) : (
              <NavButton onClick={play} $primary>
                Play
              </NavButton>
            )}
            <NavButton onClick={reset}>Reset</NavButton>
            <NavButton
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
            >
              Next
            </NavButton>
          </NavigationControls>

          <NavigationControls>
            <NavButton onClick={toggleAutoPlay} $primary={autoPlay}>
              {autoPlay ? 'Stop Auto Play' : 'Auto Play'}
            </NavButton>
          </NavigationControls>
        </>
      )}
    </Container>
  );
}

export default StoryPlayer;
