/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { useState, useEffect, useCallback } from '@googleforcreators/react';
import styled from 'styled-components';
import { 
  StoryAnimationState, 
  AnimationProvider, 
  useStoryAnimationContext 
} from '@googleforcreators/animation';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import storyData from './story.json';

// Web Stories typically have a 9:16 aspect ratio (portrait)
const STORY_RATIO = 9 / 16;
const STORY_WIDTH = 333; // Standard width for Web Stories preview
const STORY_HEIGHT = STORY_WIDTH / STORY_RATIO;

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  padding: 20px;
`;

const StoryContainer = styled.div`
  position: relative;
  width: ${STORY_WIDTH}px;
  height: ${STORY_HEIGHT}px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const NavigationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 5px;
`;

const PageDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? '#0c66e4' : '#ccc')};
  transition: background-color 0.2s ease;
`;

const NavButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ primary }) => (primary ? '#0c66e4' : '#5a5a5a')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ primary }) => (primary ? '#0a54ba' : '#444444')};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

/**
 * Internal dependencies
 */
import PagePreview from '../../footer/pagepreview';

// Styled components for animation controls
const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ControlButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ primary }) => primary ? '#0c66e4' : '#5a5a5a'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ primary }) => primary ? '#0a54ba' : '#444444'};
  }
`;

const ControlsTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

/**
 * Animation controls component
 */
const AnimationControls = () => {
  const {
    actions: { WAAPIAnimationMethods },
  } = useStoryAnimationContext();

  return (
    <ControlsContainer>
      <ControlsTitle>Animation Controls</ControlsTitle>
      <ButtonsContainer>
        <ControlButton 
          onClick={WAAPIAnimationMethods.play}
          primary
        >
          Play
        </ControlButton>
        <ControlButton 
          onClick={WAAPIAnimationMethods.pause}
        >
          Pause
        </ControlButton>
        <ControlButton 
          onClick={WAAPIAnimationMethods.reset}
        >
          Reset
        </ControlButton>
      </ButtonsContainer>
    </ControlsContainer>
  );
};

/**
 * Animation wrapper component
 */
const StoryAnimations = ({ children, animations, elements, animationState }) => {
  const resetAnimationState = useCallback(() => {
    // This would normally update the animation state in the story context
    console.log('Animation finished');
  }, []);

  return (
    <AnimationProvider
      animations={animations}
      elements={elements}
      onWAAPIFinish={resetAnimationState}
      animationState={animationState}
    >
      {children}
      <AnimationControls />
    </AnimationProvider>
  );
};

StoryAnimations.propTypes = {
  children: PropTypes.node,
  animations: PropTypes.array,
  elements: PropTypes.array,
  animationState: PropTypes.string,
};

/**
 * A component that displays a story with navigation controls.
 */
function StoryPlayer() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [animationState, setAnimationState] = useState(StoryAnimationState.Playing);
  const [autoPlay, setAutoPlay] = useState(true);

  const pages = storyData.pages;
  const currentPage = pages[currentPageIndex];

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setAnimationState(StoryAnimationState.Reset);
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setAnimationState(StoryAnimationState.Reset);
    }
  };

  const playAnimations = () => {
    setAnimationState(StoryAnimationState.Playing);
  };

  const pauseAnimations = () => {
    setAnimationState(StoryAnimationState.Paused);
  };

  const resetAnimations = () => {
    setAnimationState(StoryAnimationState.Reset);
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    if (!autoPlay) {
      setAnimationState(StoryAnimationState.Playing);
    } else {
      setAnimationState(StoryAnimationState.Paused);
    }
  };

  // Start playing animations when component mounts
  useEffect(() => {
    setAnimationState(StoryAnimationState.Playing);
  }, []);

  // Auto-advance to next page after animations finish
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      if (currentPageIndex < pages.length - 1) {
        goToNextPage();
        setAnimationState(StoryAnimationState.Playing);
      } else {
        setAutoPlay(false);
      }
    }, 5000); // 5 seconds per page

    return () => clearTimeout(timer);
  }, [currentPageIndex, autoPlay, pages.length]);

  return (
    <Container>
      <StoryContainer>
        <StoryAnimations 
          animations={currentPage.animations || []} 
          elements={currentPage.elements || []}
          animationState={animationState}
        >
          <PagePreview
            page={currentPage}
            width={STORY_WIDTH}
            as="div"
            isActive={animationState === StoryAnimationState.Playing}
            isInteractive={false}
            tabIndex={-1}
            label="Story Preview"
          />
        </StoryAnimations>
      </StoryContainer>

      <PageIndicator>
        {pages.map((_, index) => (
          <PageDot key={index} active={index === currentPageIndex} />
        ))}
      </PageIndicator>

      <NavigationControls>
        <NavButton
          onClick={goToPrevPage}
          disabled={currentPageIndex === 0}
        >
          Previous
        </NavButton>

        {animationState === StoryAnimationState.Playing ? (
          <NavButton onClick={pauseAnimations}>
            Pause
          </NavButton>
        ) : (
          <NavButton onClick={playAnimations} primary>
            Play
          </NavButton>
        )}

        <NavButton onClick={resetAnimations}>
          Reset
        </NavButton>

        <NavButton
          onClick={goToNextPage}
          disabled={currentPageIndex === pages.length - 1}
        >
          Next
        </NavButton>
      </NavigationControls>

      <NavigationControls>
        <NavButton
          onClick={toggleAutoPlay}
          primary={autoPlay}
        >
          {autoPlay ? 'Stop Auto Play' : 'Auto Play'}
        </NavButton>
      </NavigationControls>
    </Container>
  );
}

export default StoryPlayer;
