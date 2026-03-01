/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {Flex} from '../src';
import {View} from '@vue-spectrum/view';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const baseColors = [
  'celery',
  'chartreuse',
  'yellow',
  'magenta',
  'fuchsia',
  'purple',
  'indigo',
  'seafoam',
  'red',
  'orange',
  'green',
  'blue'
];
const colors: string[] = [];
for (let color of baseColors) {
  for (let i = 4; i <= 7; i++) {
    colors.push(`${color}-${i}00`);
  }
}

const meta: Meta<typeof Flex> = {
  title: 'Flex',
  component: Flex
};

export default meta;

type Story = StoryObj<typeof meta>;

export const VerticalStackWithGap: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="column" width="size-2000" gap="size-100">
        <View background-color="celery-600" height="size-800" />
        <View background-color="blue-600" height="size-800" />
        <View background-color="magenta-600" height="size-800" />
      </Flex>
    `
  })
};

export const HorizontalStackWithGap: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" height="size-800" gap="size-100">
        <View background-color="celery-600" width="size-800" />
        <View background-color="blue-600" width="size-800" />
        <View background-color="magenta-600" width="size-800" />
      </Flex>
    `
  })
};

export const WrappingWithGap: Story = {
  render: () => ({
    components: {Flex, View},
    setup() {
      return {colors};
    },
    template: `
      <div style="max-width: 80%; border: 1px solid var(--spectrum-global-color-gray-700); padding: 8px;">
        <Flex direction="row" gap="size-100" wrap>
          <View
            v-for="color in colors"
            :key="color"
            :background-color="color"
            width="size-800"
            height="size-800" />
        </Flex>
      </div>
    `
  })
};

export const NestedFlexWithGap: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="column" gap="size-150">
        <View background-color="celery-600" height="size-800" />
        <Flex direction="row" height="size-800" gap="size-100">
          <View background-color="indigo-600" width="size-800" />
          <View background-color="seafoam-600" width="size-800" />
          <View background-color="blue-600" width="size-800" />
        </Flex>
        <View background-color="magenta-600" height="size-800" />
      </Flex>
    `
  })
};

export const AlignCenter: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" align-items="center">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-2000" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  })
};

export const AlignEnd: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" align-items="end">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-2000" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  })
};

export const JustifyStart: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" justify-content="start" width="80%">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-800" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  })
};

export const JustifyCenter: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" justify-content="center" width="80%">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-800" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  })
};

export const JustifyEnd: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" justify-content="end" width="80%">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-800" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  })
};

export const JustifySpaceAround: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" justify-content="space-around" width="80%">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-800" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  })
};

export const JustifySpaceBetween: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" justify-content="space-between" width="80%">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-800" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  })
};

export const JustifySpaceEvenly: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" justify-content="space-evenly" width="80%">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-800" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  })
};

export const Ordered: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex direction="row" gap="size-100" justify-content="space-evenly" width="80%">
        <View background-color="celery-600" :order="2" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-800" />
        <View background-color="magenta-600" :order="1" width="size-800" height="size-800" />
      </Flex>
    `
  }),
  name: 'ordered'
};

export const Responsive: Story = {
  render: () => ({
    components: {Flex, View},
    template: `
      <Flex :direction="{base: 'column', L: 'row'}" :gap="{base: 'size-100', M: 'size-250', L: 'size-350'}">
        <View background-color="celery-600" width="size-800" height="size-800" />
        <View background-color="blue-600" width="size-800" height="size-800" />
        <View background-color="magenta-600" width="size-800" height="size-800" />
      </Flex>
    `
  }),
  name: 'responsive'
};
