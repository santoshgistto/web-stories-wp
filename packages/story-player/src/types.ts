/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 */

import type { Page } from '@googleforcreators/elements';

export interface PageSize {
  width: number;
  height: number;
  containerHeight: number;
}

export interface StoryPlayerProps {
  pages: Page[];
  width?: number;
  autoPlay?: boolean;
  pageDurationMs?: number;
  showControls?: boolean;
  initialPageIndex?: number;
  onPageChange?: (index: number) => void;
  onFinish?: () => void;
}
