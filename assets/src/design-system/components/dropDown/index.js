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
import { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { Menu, MENU_OPTIONS } from '../menu';
import { Popup, PLACEMENT } from '../popup';
import { DropDownContainer, Hint } from './components';
import { DEFAULT_POPUP_FILL_WIDTH } from './constants';
import DropDownSelect from './select';
import useDropDown from './useDropDown';
/**
 *
 * @param {Object} props All props.
 * @param {string} props.ariaLabel Specific label to use as select button's aria label only.
 * @param {boolean} props.disabled If true, menu will not be openable
 * @param {string} props.dropdownLabel Text shown in button with selected value's label or placeholder. Will be used as aria label if no separate ariaLabel is passed in.
 * @param {string} props.emptyText If the array of options is empty this text will display when menu is expanded.
 * @param {string} props.hint Hint text to display below a dropdown (optional). If not present, no hint text will display.
 * @param {boolean} props.isKeepMenuOpenOnSelection If true, when a new selection is made the internal functionality to close the menu will not fire, by default is false.
 * @param {boolean} props.isRTL If true, arrow left will trigger down, arrow right will trigger up.
 * @param {Object} props.menuStylesOverride should be formatted as a css template literal with styled components. Gives access to completely overriding dropdown menu styles (container div > ul > li).
 * @param {Function} props.onMenuItemClick Triggered when a user clicks or presses 'Enter' on an option.
 * @param {Array} props.options All options, should contain either 1) objects with a label, value, anything else you need can be added and accessed through renderItem or 2) Objects containing a label and options, where options is structured as first option with array of objects containing at least value and label - this will create a nested list.
 * @param {number} props.popupFillWidth Allows for an override of how much of popup width to take up for dropDown.
 * @param {number} props.popupZIndex Allows for an override of the default popup z index (2).
 * @param {string} props.placement placement passed to popover for where menu should expand, defaults to "bottom_end".
 * @param {Function} props.renderItem If present when menu is open, will override the base list items rendered for each option, the entire item and whether it is selected will be returned and allow you to style list items internal to a list item without affecting dropdown functionality.
 * @param {string} props.selectedValue the selected value of the dropDown. Should correspond to a value in the options array of objects.
 *
 */

export const DropDown = ({
  ariaLabel,
  disabled,
  dropDownLabel,
  hasError,
  hint,
  isKeepMenuOpenOnSelection,
  onMenuItemClick,
  options = [],
  placement = PLACEMENT.BOTTOM,
  popupFillWidth = DEFAULT_POPUP_FILL_WIDTH,
  popupZIndex,
  selectedValue = '',
  ...rest
}) => {
  const selectRef = useRef();

  const { activeOption, isOpen, normalizedOptions } = useDropDown({
    options,
    selectedValue,
  });

  const handleSelectClick = useCallback(
    (event) => {
      event.preventDefault();
      isOpen.set((prevIsOpen) => !prevIsOpen);
    },
    [isOpen]
  );

  const handleDismissMenu = useCallback(() => {
    isOpen.set(false);
    selectRef.current.focus();
  }, [isOpen]);

  const handleMenuItemClick = useCallback(
    (event, menuItem) => {
      onMenuItemClick && onMenuItemClick(event, menuItem);

      if (!isKeepMenuOpenOnSelection) {
        handleDismissMenu();
      }
    },
    [handleDismissMenu, isKeepMenuOpenOnSelection, onMenuItemClick]
  );

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const selectButtonId = useMemo(() => `select-button-${uuidv4()}`, []);

  return (
    <DropDownContainer>
      <DropDownSelect
        activeItemLabel={activeOption?.label}
        aria-pressed={isOpen.value}
        aria-disabled={disabled}
        aria-expanded={isOpen.value}
        aria-label={ariaLabel || dropDownLabel}
        aria-owns={listId}
        disabled={disabled}
        dropDownLabel={dropDownLabel}
        hasError={hasError}
        id={selectButtonId}
        isOpen={isOpen.value}
        onSelectClick={handleSelectClick}
        ref={selectRef}
        {...rest}
      />
      {!disabled && (
        <Popup
          anchor={selectRef}
          isOpen={isOpen.value}
          placement={placement}
          fillWidth={popupFillWidth}
          zIndex={popupZIndex}
        >
          <Menu
            activeValue={activeOption?.value}
            parentId={selectButtonId}
            listId={listId}
            menuAriaLabel={sprintf(
              /* translators: %s: dropdown aria label or general dropdown label if there is no specific aria label. */
              __('%s Option List Selector', 'web-stories'),
              ariaLabel || dropDownLabel
            )}
            onDismissMenu={handleDismissMenu}
            onMenuItemClick={handleMenuItemClick}
            options={normalizedOptions}
            {...rest}
          />
        </Popup>
      )}
      {hint && (
        <Hint
          hasError={hasError}
          size={THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES.SMALL}
        >
          {hint}
        </Hint>
      )}
    </DropDownContainer>
  );
};

DropDown.propTypes = {
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  dropDownLabel: PropTypes.string,
  hasError: PropTypes.bool,
  hint: PropTypes.string,
  isKeepMenuOpenOnSelection: PropTypes.bool,
  isRTL: PropTypes.bool,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  options: MENU_OPTIONS,
  onMenuItemClick: PropTypes.func,
  placeholder: PropTypes.string,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  popupFillWidth: PropTypes.number,
  popupZIndex: PropTypes.number,
  renderItem: PropTypes.object,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};
