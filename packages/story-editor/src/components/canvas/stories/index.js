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
import { createElement, Fragment, createContext, useContext } from '@googleforcreators/react';
import styled from 'styled-components';
import { StoryAnimationState } from '@googleforcreators/animation';
import PropTypes from 'prop-types';
import { ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import fashionInspirationTemplate from '../../../templates/fashionInspiration';

// Use createElement and Fragment from @googleforcreators/react
const React = { createElement, Fragment };

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
      defaultValue: '#f2f2f2',
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
        'ac0ad0ca-5d24-40c4-90bd-e20385e6584e',
        '3cccfd70-c5ed-4e0a-84f8-8356b205e519',
        'be6b55fc-a396-4cfb-8e1b-4e5eb8c963cd',
        'e6faaf99-9591-482a-90f6-c89ee6f7850b',
        'fdd58d7f-a517-4b39-b1d2-293d57ada467',
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
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  padding: 20px;
`;

const StoryContainer = styled.div`
  width: ${STORY_WIDTH}px;
  height: ${STORY_HEIGHT}px;
  position: relative;
  background-color: ${({ backgroundColor }) => backgroundColor || '#f2f2f2'};
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

// Helper function to convert hex color to RGB
const hexToRgb = (hex = '#f2f2f2') => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
};

/**
 * A story that uses a simplified version of the DisplayLayer component.
 */
const StoryDisplayLayerPreview = ({ 
  backgroundColor = '#f2f2f2', 
  showAnimations = false, 
  selectedElementId = '' 
}) => {
  // Convert hex color to RGB for the page background
  const rgbColor = hexToRgb(backgroundColor);

  // Create a modified page with the provided background color
  const currentPage = {
    ...fashionInspirationTemplate.pages[0],
    backgroundColor: { color: rgbColor },
  };

  // Scale factor to fit the elements in the story container
  const scaleX = STORY_WIDTH / 412; // Assuming the template was designed for a 412px width
  const scaleY = STORY_HEIGHT / 618; // Assuming the template was designed for a 618px height

  return (
    <Container>
      <StoryContainer backgroundColor={backgroundColor}>
        {/* Render the elements from the template */}
        {currentPage.elements.map((element) => {
          if (element.isHidden) {
            return null;
          }

          return (
            <div
              key={element.id}
              style={{
                position: 'absolute',
                left: `${element.x * scaleX}px`,
                top: `${element.y * scaleY}px`,
                width: `${element.width * scaleX}px`,
                height: `${element.height * scaleY}px`,
                transform: `rotate(${element.rotationAngle}deg)`,
                backgroundColor: element.backgroundColor?.color ? 
                  `rgb(${element.backgroundColor.color.r}, ${element.backgroundColor.color.g}, ${element.backgroundColor.color.b})` : 
                  'transparent',
                opacity: element.opacity / 100,
                border: selectedElementId === element.id ? '2px solid blue' : 'none',
                zIndex: element.isBackground ? 0 : 1,
                overflow: 'hidden',
              }}
            >
              {element.type === 'text' && (
                <div 
                  dangerouslySetInnerHTML={{ __html: element.content }}
                  style={{
                    fontSize: `${element.fontSize * scaleX}px`,
                    lineHeight: element.lineHeight,
                    textAlign: element.textAlign,
                    fontFamily: element.font?.family || 'sans-serif',
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
              {element.type === 'image' && element.resource && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${element.resource.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              )}
              {element.type === 'shape' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: element.backgroundColor?.color ? 
                      `rgb(${element.backgroundColor.color.r}, ${element.backgroundColor.color.g}, ${element.backgroundColor.color.b})` : 
                      'transparent',
                    borderRadius: element.mask?.type === 'circle' ? '50%' : '0',
                  }}
                />
              )}
            </div>
          );
        })}
      </StoryContainer>
    </Container>
  );
};

StoryDisplayLayerPreview.propTypes = {
  backgroundColor: PropTypes.string,
  showAnimations: PropTypes.bool,
  selectedElementId: PropTypes.string,
};

// Story component
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
