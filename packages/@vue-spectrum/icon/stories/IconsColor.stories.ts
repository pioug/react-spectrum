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
import CalendarCheckColor from '@spectrum-icons-vue/workflow/CalendarCheckColor';
import {Icon} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta = {
  title: 'Icons/Color',
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

export const ColorIconWithSizes: Story = {
  render: () => renderIconSizes(CalendarCheckColor, {'aria-label': 'Adobe Analytics Color'})
};

ColorIconWithSizes.story = {
  name: 'Color icon with sizes'
};
