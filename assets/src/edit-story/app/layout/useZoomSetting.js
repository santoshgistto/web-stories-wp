/*
 * Copyright 2020 Google LLC
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
import { useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import {
  PAGE_WIDTH,
  PAGE_RATIO,
  FULLBLEED_RATIO,
  ZOOM_SETTING,
  PAGE_NAV_WIDTH,
} from '../../constants';

function useZoomSetting() {
  // TODO store in localSettings?
  const [zoomSetting, setZoomSetting] = useState(ZOOM_SETTING.FIT);
  const [workspaceSize, setWorkspaceSize] = useState({
    width: null,
    height: null,
  });

  const state = useMemo(() => {
    // Calculate page size based on zoom setting
    let maxPageWidth;
    const workspaceRatio = workspaceSize.width / workspaceSize.height;
    switch (zoomSetting) {
      case ZOOM_SETTING.FILL: {
        // See how much we can fit inside so all space is used
        if (workspaceRatio > FULLBLEED_RATIO) {
          // workspace is limited in the height, so use the full width
          maxPageWidth = workspaceSize.width;
        } else {
          // workspace is limited in the width, so use the full height converted
          maxPageWidth = workspaceSize.height * FULLBLEED_RATIO;
        }
        break;
      }
      case ZOOM_SETTING.FIT: {
        // See how much we can fit inside so all is visible
        if (workspaceRatio > FULLBLEED_RATIO) {
          // workspace is limited in the height, so use the height converted
          maxPageWidth = workspaceSize.height * FULLBLEED_RATIO;
        } else {
          // workspace is limited in the width, so use the width
          maxPageWidth = workspaceSize.width;
        }
        break;
      }
      case ZOOM_SETTING.SINGLE: {
        maxPageWidth = PAGE_WIDTH;
        break;
      }
      case ZOOM_SETTING.DOUBLE: {
        maxPageWidth = 2 * PAGE_WIDTH;
        break;
      }
      case ZOOM_SETTING.TRIPLE: {
        maxPageWidth = 3 * PAGE_WIDTH;
        break;
      }
      default:
        // do nothing for any of the fixed settings
        break;
    }
    // Floor page width to nearest multiple of 12
    const pageWidth = 12 * Math.floor(maxPageWidth / 12);
    // Update whether there's overflow and if we have room for page navigation
    const pageHeight = pageWidth / PAGE_RATIO;
    const fullbleedHeight = pageWidth / FULLBLEED_RATIO;
    const hasHorizontalOverflow = pageWidth > workspaceSize.width;
    const hasVerticalOverflow = fullbleedHeight > workspaceSize.height;
    const hasPageNavigation =
      pageWidth < workspaceSize.width - 2 * PAGE_NAV_WIDTH;
    return {
      zoomSetting,
      pageWidth,
      pageHeight,
      hasHorizontalOverflow,
      hasVerticalOverflow,
      hasPageNavigation,
      workspaceWidth: workspaceSize.width,
      workspaceHeight: workspaceSize.height,
    };
  }, [workspaceSize, zoomSetting]);

  return {
    state,
    actions: {
      setZoomSetting,
      setWorkspaceSize,
    },
  };
}

export default useZoomSetting;