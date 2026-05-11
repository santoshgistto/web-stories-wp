/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 */

import { View, Image } from 'react-native-web';
import type { ViewStyle, ImageStyle } from 'react-native';
import { getMediaSizePositionProps } from '@googleforcreators/media';
import type { ImageElement } from '@googleforcreators/elements';

import { computeBox, getEffectiveBox, getRenderScales, rgbToStyle } from '../utils';
import type { RNPageSize } from '../types';

interface Props {
  element: ImageElement;
  pageSize: RNPageSize;
}

/**
 * Web Stories image element rendered with react-native-web. Structure:
 *
 *   <View>   ← outer "frame": position, rotation, flip, opacity,
 *              border, borderRadius, overflow:hidden (clip)
 *     <Image/> ← oversized cropped inner image, offset per focal point
 *   </View>
 *
 * Mirrors the DOM renderer's MediaOutput + MediaDisplay split. The crop
 * math comes from `getMediaSizePositionProps` (same source of truth used
 * by the editor and AMP output) so a given JSON crops identically here.
 *
 * Still TODO: non-rectangle mask shapes (need `react-native-svg`),
 * animations (need `react-native-reanimated`), `overlay` color blend.
 */
export default function ImageRN({ element, pageSize }: Props) {
  const src = element.resource?.src;
  if (!src) {
    return null;
  }

  const effective = getEffectiveBox(element);
  const outerBox = computeBox(effective, pageSize);
  const { scaleX, scaleY } = getRenderScales(pageSize);

  const mediaProps = getMediaSizePositionProps(
    element.resource,
    effective.width,
    effective.height,
    element.scale,
    element.focalX,
    element.focalY
  );

  // RN's transform array is typed as a readonly union; build it locally as
  // a plain array and let RN-Web's style system accept it.
  const transforms: Array<Record<string, number | string>> = [];
  const rotation = element.rotationAngle ?? 0;
  if (rotation) {
    transforms.push({ rotate: `${rotation}deg` });
  }
  if (element.flip?.horizontal) {
    transforms.push({ scaleX: -1 });
  }
  if (element.flip?.vertical) {
    transforms.push({ scaleY: -1 });
  }

  const opacityRaw = element.opacity ?? 100;

  // borderRadius is stored in data px; use the smaller axis scale so
  // corners stay visually circular when the page aspect ratio differs.
  const cornerScale = Math.min(scaleX, scaleY);
  const br = element.borderRadius;
  const borderRadiusStyle: ViewStyle = br
    ? {
        borderTopLeftRadius: br.topLeft * cornerScale,
        borderTopRightRadius: br.topRight * cornerScale,
        borderBottomLeftRadius: br.bottomLeft * cornerScale,
        borderBottomRightRadius: br.bottomRight * cornerScale,
      }
    : {};

  const b = element.border;
  const borderStyle: ViewStyle = b
    ? {
        borderTopWidth: b.top * scaleY,
        borderBottomWidth: b.bottom * scaleY,
        borderLeftWidth: b.left * scaleX,
        borderRightWidth: b.right * scaleX,
        borderColor: b.color ? rgbToStyle(b.color) : '#000000',
        borderStyle: 'solid',
      }
    : {};

  const transformStyle =
    transforms.length > 0
      ? ({ transform: transforms } as unknown as Pick<ViewStyle, 'transform'>)
      : null;

  const outerStyle: ViewStyle = {
    position: 'absolute',
    left: outerBox.x,
    top: outerBox.y,
    width: outerBox.width,
    height: outerBox.height,
    opacity: opacityRaw / 100,
    overflow: 'hidden',
    ...transformStyle,
    ...borderRadiusStyle,
    ...borderStyle,
  };

  const innerStyle: ImageStyle = {
    position: 'absolute',
    left: -mediaProps.offsetX * scaleX,
    top: -mediaProps.offsetY * scaleY,
    width: mediaProps.width * scaleX,
    height: mediaProps.height * scaleY,
  };

  return (
    <View style={outerStyle}>
      <Image
        source={{ uri: src }}
        resizeMode="cover"
        accessibilityLabel={element.resource?.alt ?? ''}
        style={innerStyle}
      />
    </View>
  );
}
