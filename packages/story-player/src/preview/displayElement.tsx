/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Ported from packages/story-editor/src/components/canvas/displayElement.js
 * — with the three editor-only React contexts (useLocalMedia, useFont,
 * useConfig) and useCORSProxy replaced by inert local stubs, since none of
 * those have meaningful behavior in a static player.
 *
 * @ts-nocheck — this is a near-verbatim port of a plain-JS file. The
 * upstream relies on loose duck-typing across the element/element-library/
 * masks packages (whose own .d.ts emit is imperfect). Keeping strict TS
 * here would require restructuring upstream types, which is out of scope.
 * Runtime semantics match the upstream JS.
 */
// @ts-nocheck

import { memo, useRef } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import { generatePatternStyles } from '@googleforcreators/patterns';
import { calcRotatedResizeOffset, useUnits } from '@googleforcreators/units';
import { WAAPIWrapper } from '@googleforcreators/animation';
import { useTransformHandler } from '@googleforcreators/transform';
import { getDefinitionForType } from '@googleforcreators/elements';
import type { Element } from '@googleforcreators/elements';
import {
  elementWithPosition,
  elementWithRotation,
  elementWithSize,
  useColorTransformHandler,
} from '@googleforcreators/element-library';
import {
  canSupportMultiBorder,
  DisplayWithMask as WithMask,
  getResponsiveBorder,
} from '@googleforcreators/masks';
import type { ReactNode } from 'react';

import renderResourcePlaceholder from './renderResourcePlaceholder';
import { maybeEnqueueFontStyle } from './loadFont';

// In a player there's no editor app context, so we provide inert stubs for
// the editor-only hooks DisplayElement consumes (useLocalMedia, useConfig).
// `maybeEnqueueFontStyle` is NOT stubbed — text elements depend on it to
// inject Google Fonts CSS; without a real implementation fonts never load.
const PROXIED_URL_IDENTITY = (_resource: Resource, src?: string) =>
  src ?? null;

interface WrapperAttrs {
  previewMode?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotationAngle?: number;
  isBackground?: boolean;
}

const Wrapper = styled.div.attrs<WrapperAttrs>(
  ({ previewMode, x, y, width, height, rotationAngle }) => {
    const style = {
      position: 'absolute' as const,
      zIndex: 1,
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
      transform: `rotate(${rotationAngle}deg)`,
    };
    return previewMode ? { style } : {};
  }
)<WrapperAttrs>`
  ${({ previewMode }) => !previewMode && elementWithPosition}
  ${({ previewMode }) => !previewMode && elementWithSize}
  ${({ previewMode }) => !previewMode && elementWithRotation}
  contain: layout;
  transition: opacity 0.15s cubic-bezier(0, 0, 0.54, 1);
  ${({ isBackground, theme }) =>
    isBackground &&
    css`
      border-radius: ${theme.borders.radius.small};
      overflow: hidden;
    `}
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const ReplacementContainer = styled.div<{ hasReplacement: boolean }>`
  transition: opacity 0.25s cubic-bezier(0, 0, 0.54, 1);
  pointer-events: none;
  opacity: ${({ hasReplacement }) => (hasReplacement ? 1 : 0)};
  height: 100%;
`;

interface AnimationWrapperProps {
  children: ReactNode;
  id: string;
  isAnimatable: boolean;
}

function AnimationWrapper({ children, id, isAnimatable }: AnimationWrapperProps) {
  return isAnimatable ? (
    <WAAPIWrapper target={id}>{children}</WAAPIWrapper>
  ) : (
    <>{children}</>
  );
}

interface DisplayElementProps {
  element: Element;
  previewMode?: boolean;
  isAnimatable?: boolean;
  siblingCount?: number;
  cdnUrl?: string;
}

function DisplayElement({
  element,
  previewMode,
  isAnimatable = false,
  siblingCount = 0,
  cdnUrl = '',
}: DisplayElementProps) {
  const { getBox, getBoxWithBorder, dataToEditorX } = useUnits(
    (state: never) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getBox: (state as any).actions.getBox,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getBoxWithBorder: (state as any).actions.getBoxWithBorder,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataToEditorX: (state as any).actions.dataToEditorX,
    })
  );

  // Editor-context replacements (see file header). The per-element-type Display
  // components from element-library call isCurrentResourceProcessing/Uploading
  // as functions (passing a resource id) — in the editor they come from the
  // useLocalMedia selector. In a player media is never uploading/processing,
  // so we return false unconditionally.
  const getProxiedUrl = PROXIED_URL_IDENTITY;
  const cdnURL = cdnUrl;
  const isCurrentResourceProcessing = () => false;
  const isCurrentResourceUploading = () => false;

  // The editor's DisplayElement supports drag-to-replace (showing a swap-in
  // preview); a player is static so replacement state is always null.
  const hasReplacement = false;

  const {
    id,
    opacity,
    type,
    isBackground,
    overlay,
    border,
    rotationAngle,
  } = element as Element & {
    overlay?: unknown;
    border?: { left?: number; right?: number; top?: number; bottom?: number };
  };

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { left = 0, right = 0, top = 0, bottom = 0 } = border || {};
  useTransformHandler(id, (transform: unknown) => {
    const target = wrapperRef.current;
    if (!target) return;
    if (transform === null) {
      target.style.transform = '';
      target.style.width = '';
      target.style.height = '';
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = transform as any;
    const { translate = [0, 0], rotate, resize } = t;
    let dx = 0;
    let dy = 0;
    if (resize && resize[0] !== 0 && resize[1] !== 0) {
      target.style.width = `${resize[0]}px`;
      target.style.height = `${resize[1]}px`;
      if (canSupportMultiBorder(element)) {
        const [_dx, _dy] = calcRotatedResizeOffset(
          rotationAngle,
          0,
          left + right,
          0,
          top + bottom
        );
        dx = _dx;
        dy = _dy;
      }
    }
    target.style.transform = `translate(${translate[0] - dx}px, ${
      translate[1] - dy
    }px) rotate(${rotate}deg)`;
  });

  const bgOverlayRef = useRef<HTMLDivElement | null>(null);
  useColorTransformHandler({
    id,
    targetRef: bgOverlayRef,
    resetOnNullTransform: false,
  });

  if ((element as { isHidden?: boolean }).isHidden) {
    return null;
  }

  const { Display } = getDefinitionForType(type);
  if (!Display) {
    return null;
  }

  // The element content will use box without border; the wrapper uses box with
  // border. Same logic as the editor's DisplayElement.
  const box = getBox(element);
  const boxWithBorder = getBoxWithBorder(element);

  const responsiveBorder = getResponsiveBorder(
    border,
    previewMode,
    dataToEditorX
  );

  return (
    <Wrapper
      ref={wrapperRef}
      data-element-id={id}
      isBackground={isBackground}
      previewMode={previewMode}
      {...(previewMode ? box : boxWithBorder)}
    >
      <AnimationWrapper id={id} isAnimatable={isAnimatable}>
        <WithMask
          element={element}
          fill
          style={{
            opacity: typeof opacity !== 'undefined' ? opacity / 100 : null,
          }}
          previewMode={previewMode}
          responsiveBorder={responsiveBorder}
        >
          <Display
            element={element}
            previewMode={previewMode}
            box={box}
            getProxiedUrl={getProxiedUrl}
            isCurrentResourceProcessing={isCurrentResourceProcessing}
            isCurrentResourceUploading={isCurrentResourceUploading}
            maybeEnqueueFontStyle={maybeEnqueueFontStyle}
            siblingCount={siblingCount}
            renderResourcePlaceholder={renderResourcePlaceholder}
            cdnUrl={cdnURL}
          />
        </WithMask>
        <ReplacementContainer hasReplacement={hasReplacement} />
        {isBackground && overlay && (
          <BackgroundOverlay
            ref={bgOverlayRef}
            style={generatePatternStyles(overlay as never)}
          />
        )}
      </AnimationWrapper>
    </Wrapper>
  );
}

export default memo(DisplayElement);
