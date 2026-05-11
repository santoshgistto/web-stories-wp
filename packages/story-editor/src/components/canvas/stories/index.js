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
import { createElement, Fragment, useState, useCallback } from '@googleforcreators/react';
import styled from 'styled-components';
import { 
  StoryAnimationState, 
  AnimationProvider, 
  useStoryAnimationContext 
} from '@googleforcreators/animation';
import PropTypes from 'prop-types';
import { elementTypes } from '@googleforcreators/element-library';
import { registerElementType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import PagePreview from '../../footer/pagepreview';

// Use createElement and Fragment from @googleforcreators/react
const React = { createElement, Fragment };

// Register all element types
elementTypes.forEach(registerElementType);

// Mock data for the story page
const MOCK_PAGE = {
  elements: [
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundColor: { color: { r: 196, g: 196, b: 196 } },
      x: 1,
      y: 1,
      width: 1,
      height: 1,
      mask: { type: 'rectangle' },
      isBackground: true,
      id: '35fb893b-2834-47f0-aa77-c566bb5b580d',
      isDefaultBackground: true,
      type: 'shape',
    },
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundTextMode: 'NONE',
      font: {
        family: 'Chivo',
        fallbacks: ['sans-serif'],
        weights: [300, 400, 700, 900],
        styles: ['italic', 'regular'],
        variants: [
          [0, 300],
          [1, 300],
          [0, 400],
          [1, 400],
          [0, 700],
          [1, 700],
          [0, 900],
          [1, 900],
        ],
        service: 'fonts.google.com',
        metrics: {
          upm: 1000,
          asc: 940,
          des: -250,
          tAsc: 940,
          tDes: -250,
          tLGap: 0,
          wAsc: 937,
          wDes: 250,
          xH: 511,
          capH: 686,
          yMin: -250,
          yMax: 926,
          hAsc: 940,
          hDes: -250,
          lGap: 0,
        },
      },
      fontSize: 28,
      backgroundColor: { color: { r: 196, g: 196, b: 196 } },
      lineHeight: 1.3,
      textAlign: 'center',
      padding: { horizontal: 0, vertical: 0 },
      x: 118.5,
      y: 554,
      width: 175,
      height: 36,
      id: 'fed8bce3-2eda-4780-9f18-42dde7824944',
      content: '<span style="font-weight: 900; color: #28292b">Anonymous</span>',
      type: 'text',
    },
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      x: 40,
      y: 3,
      width: 66,
      height: 57,
      sticker: { type: 'beautyHeart' },
      id: '4a61ba51-005e-4f4c-9d39-b9ebc6a37ba7',
      groupId: 'dc20376a-95ab-4347-9ea4-5b6864a83a7a',
      type: 'sticker',
    },
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      width: 66,
      height: 57,
      sticker: { type: 'beautyHeart' },
      id: '6ee64c70-585d-4095-954f-cccb7c630b5a',
      x: 316,
      y: 45,
      groupId: 'dc20376a-95ab-4347-9ea4-5b6864a83a7a',
      type: 'sticker',
    },
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      width: 66,
      height: 57,
      sticker: { type: 'beautyHeart' },
      id: 'ce788cb6-77b2-4a12-9165-62ffbd871924',
      x: 30,
      y: 235,
      groupId: 'dc20376a-95ab-4347-9ea4-5b6864a83a7a',
      type: 'sticker',
    },
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      width: 66,
      height: 57,
      sticker: { type: 'beautyHeart' },
      id: '926a72b2-8304-4171-b62f-c0aa05a161c7',
      x: 337,
      y: 540,
      groupId: 'dc20376a-95ab-4347-9ea4-5b6864a83a7a',
      type: 'sticker',
    },
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      width: 66,
      height: 57,
      sticker: { type: 'beautyHeart' },
      id: 'fa2fcc14-073b-4bcc-aea7-2d8d48dc4415',
      x: 6,
      y: 590,
      groupId: 'dc20376a-95ab-4347-9ea4-5b6864a83a7a',
      type: 'sticker',
    },
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundTextMode: 'NONE',
      font: {
        family: 'Bungee',
        fallbacks: ['cursive'],
        weights: [400],
        styles: ['regular'],
        variants: [[0, 400]],
        service: 'fonts.google.com',
        metrics: {
          upm: 1000,
          asc: 860,
          des: -140,
          tAsc: 860,
          tDes: -140,
          tLGap: 200,
          wAsc: 1634,
          wDes: 914,
          xH: 500,
          capH: 720,
          yMin: -916,
          yMax: 1636,
          hAsc: 860,
          hDes: -140,
          lGap: 200,
        },
      },
      fontSize: 88,
      backgroundColor: { color: { r: 196, g: 196, b: 196 } },
      lineHeight: 1.02,
      textAlign: 'center',
      padding: { horizontal: 0, vertical: 0 },
      x: 61,
      y: 26,
      width: 309,
      height: 539,
      id: '8769c19e-327b-4025-b162-369dc5de3c28',
      content:
        '<span style="color: #28292b; letter-spacing: 0.09em; text-transform: uppercase">I</span>\n<span style="color: #28292b; letter-spacing: 0.09em; text-transform: uppercase">woke</span>\n<span style="color: #28292b; letter-spacing: 0.09em; text-transform: uppercase">up</span>\n<span style="color: #28292b; letter-spacing: 0.09em; text-transform: uppercase">like</span>\n<span style="color: #28292b; letter-spacing: 0.09em; text-transform: uppercase">this</span>\n<span style="color: #28292b; letter-spacing: 0.09em; text-transform: uppercase">"</span>',
      tagName: 'p',
      type: 'text',
    },
  ],
  backgroundColor: { color: { r: 233, g: 213, b: 197 } },
  animations: [
    {
      id: '33e49f93-0214-491d-b9d9-1df31ab7fa25',
      type: 'effect-fly-in',
      targets: ['fed8bce3-2eda-4780-9f18-42dde7824944'],
      flyInDir: 'bottomToTop',
      duration: 900,
      delay: 1000,
    },
    {
      id: '248a15d7-fd3d-419b-8844-0b47f49d1f51',
      type: 'effect-pulse',
      targets: ['8769c19e-327b-4025-b162-369dc5de3c28'],
      scale: 0.15,
      iterations: 1,
      duration: 1500,
      delay: 0,
    },
  ],
  type: 'page',
  id: '449ed18d-4387-466b-8ef4-cdb5463113d3',
  pageTemplateType: 'quote',
  groups: {
    'dc20376a-95ab-4347-9ea4-5b6864a83a7a': {
      name: 'Background',
      isLocked: true,
      isCollapsed: true,
    },
  },
};

/**
 * Internal dependencies
 */
import StoryPlayer from './storyPlayer';
import { StoryPlayer as PackagedStoryPlayer } from '@googleforcreators/story-player';
import storyData from './story.json';

export default {
  title: 'Stories Editor/Canvas/DisplayLayer',
  parameters: {
    controls: {
      expanded: true,
    },
  },
  argTypes: {
    backgroundColor: {
      control: 'color',
      defaultValue: '#e9d5c5',
      description: 'Background color of the story page',
    },
    showAnimations: {
      control: 'boolean',
      defaultValue: false,
      description: 'Toggle animations on/off',
    },
    selectedElementId: {
      control: 'select',
      options: [
        '',
        '35fb893b-2834-47f0-aa77-c566bb5b580d',
        'fed8bce3-2eda-4780-9f18-42dde7824944',
        '4a61ba51-005e-4f4c-9d39-b9ebc6a37ba7',
        '6ee64c70-585d-4095-954f-cccb7c630b5a',
        'ce788cb6-77b2-4a12-9165-62ffbd871924',
        '926a72b2-8304-4171-b62f-c0aa05a161c7',
        'fa2fcc14-073b-4bcc-aea7-2d8d48dc4415',
        '8769c19e-327b-4025-b162-369dc5de3c28',
      ],
      defaultValue: '',
      description: 'Select an element to highlight',
    },
  },
};

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
const StoryAnimations = ({ children, animations, elements }) => {
  const resetAnimationState = useCallback(() => {
    // This would normally update the animation state in the story context
    console.log('Animation finished');
  }, []);

  return (
    <AnimationProvider
      animations={animations}
      elements={elements}
      onWAAPIFinish={resetAnimationState}
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
};

/**
 * A story that uses the PagePreview component to render the elements.
 */
const StoryDisplayLayerPreview = ({ 
  backgroundColor = '#e9d5c5', 
  showAnimations = false, 
  selectedElementId = '' 
}) => {
  // Create a modified page with the provided background color
  const currentPage = {
    ...MOCK_PAGE,
    backgroundColor: { 
      color: { 
        r: parseInt(backgroundColor.slice(1, 3), 16),
        g: parseInt(backgroundColor.slice(3, 5), 16),
        b: parseInt(backgroundColor.slice(5, 7), 16)
      } 
    },
  };

  return (
    <Container>
      <StoryAnimations 
        animations={currentPage.animations} 
        elements={currentPage.elements}
      >
        <PagePreview
          page={currentPage}
          width={STORY_WIDTH}
          as="div"
          isActive={false}
          isInteractive={false}
          tabIndex={-1}
          label="Story Preview"
        />
      </StoryAnimations>
    </Container>
  );
};

StoryDisplayLayerPreview.propTypes = {
  backgroundColor: PropTypes.string,
  showAnimations: PropTypes.bool,
  selectedElementId: PropTypes.string,
};

// Story components
export const _default = StoryDisplayLayerPreview;

// Add a description to the story
_default.storyName = 'Display Layer Preview';
_default.parameters = {
  docs: {
    description: {
      story: 'This story demonstrates the DisplayLayer component with a sample story template. Use the controls to customize the appearance and behavior.',
    },
  },
};

// Story Player component that shows a full story with navigation
export const FullStoryPlayer = () => <StoryPlayer />;

FullStoryPlayer.storyName = 'Full Story Player';
FullStoryPlayer.parameters = {
  docs: {
    description: {
      story: 'This story demonstrates a full story player with navigation controls and animations. You can navigate between pages and play animations.',
    },
  },
  controls: { hideNoControlsWarning: true },
};

// Same player, but consumed from the @googleforcreators/story-player package.
export const PackagedFullStoryPlayer = () => (
  <PackagedStoryPlayer pages={storyData.pages} />
);

PackagedFullStoryPlayer.storyName =
  'Full Story Player (from @googleforcreators/story-player)';
PackagedFullStoryPlayer.parameters = {
  docs: {
    description: {
      story:
        'Same demo as "Full Story Player", but rendered via the standalone @googleforcreators/story-player package (TypeScript, decoupled from the editor footer/PagePreview). Proves the new package is consumable end-to-end.',
    },
  },
  controls: { hideNoControlsWarning: true },
};
