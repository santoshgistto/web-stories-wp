/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Minimal placeholder renderer for the player. The editor's version uses
 * react-blurhash for fancy media placeholders during uploads; in a player
 * media is already uploaded, so a flat base-color block (or null) is enough.
 */

import styled from 'styled-components';

interface PlaceholderProps {
  blurHash?: string;
  baseColor?: string;
}

const BaseColorContainer = styled.div<{ $baseColor: string }>`
  position: absolute !important;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${({ $baseColor }) => $baseColor};
`;

function renderResourcePlaceholder({ baseColor }: PlaceholderProps) {
  if (baseColor) {
    return <BaseColorContainer $baseColor={baseColor} />;
  }
  return null;
}

export default renderResourcePlaceholder;
