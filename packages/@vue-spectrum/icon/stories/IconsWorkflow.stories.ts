/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {h, type DefineComponent} from 'vue';
import _3DMaterials from '@spectrum-icons-vue/workflow/3DMaterials';
import Add from '@spectrum-icons-vue/workflow/Add';
import Alert from '@spectrum-icons-vue/workflow/Alert';
import Bell from '@spectrum-icons-vue/workflow/Bell';
import {Icon} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'Icons/Workflow',
  providerSwitcher: {status: 'positive'}
} as Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

const iconSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

function renderIconSizes(Component: DefineComponent, props: Record<string, string>) {
  return {
    setup() {
      return () => h(
        'div',
        iconSizes.map((size) => h(Component, {
          key: size,
          size,
          style: 'margin: 15px;',
          ...props
        }))
      );
    }
  };
}

export const IconAddWithSizes: Story = {
  render: () => renderIconSizes(Add, {'aria-label': 'Add'})
};

IconAddWithSizes.story = {
  name: 'icon: Add with sizes'
};

export const IconBellWithSizes: Story = {
  render: () => renderIconSizes(Bell, {'aria-label': 'Bell'})
};

IconBellWithSizes.story = {
  name: 'icon: Bell with sizes'
};

export const Icon3DMaterialsWithSizes: Story = {
  render: () => renderIconSizes(_3DMaterials, {'aria-label': '3D Materials'})
};

Icon3DMaterialsWithSizes.story = {
  name: 'icon: _3DMaterials with sizes'
};

export const IconAlertNegative: Story = {
  render: () => renderIconSizes(Alert, {'aria-label': 'Alert', color: 'negative'})
};

IconAlertNegative.story = {
  name: 'icon: Alert negative'
};

export const IconAlertInformative: Story = {
  render: () => renderIconSizes(Alert, {'aria-label': 'Alert', color: 'informative'})
};

IconAlertInformative.story = {
  name: 'icon: Alert informative'
};

export const IconAlertPositive: Story = {
  render: () => renderIconSizes(Alert, {'aria-label': 'Alert', color: 'positive'})
};

IconAlertPositive.story = {
  name: 'icon: Alert positive'
};

export const IconAlertNotice: Story = {
  render: () => renderIconSizes(Alert, {'aria-label': 'Alert', color: 'notice'})
};

IconAlertNotice.story = {
  name: 'icon: Alert notice'
};
