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
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { Wrapper } from '../components';
import AlertContainer from '../container';

export default {
  title: 'Dashboard/Components/Alert',
  component: AlertContainer,
};

export const _default = () => {
  return (
    <Wrapper>
      <AlertContainer
        message={text('errorMessage', 'this is an error')}
        severity="error"
      />
      <AlertContainer
        message={text('warningMessage', 'this is a warning')}
        severity="warning"
      />
      <AlertContainer
        message={text('infoMessage', 'this is informational')}
        severity="info"
      />
      <AlertContainer
        message={text('successMessage', 'this is successful')}
        severity="success"
      />
    </Wrapper>
  );
};
