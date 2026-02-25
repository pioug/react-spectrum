import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {View} from '../src';

const meta: Meta<typeof View> = {
  title: 'View',
  component: View
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {View},
    setup() {
      return {args};
    },
    template: '<View v-bind="args">Example</View>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {View},
    setup() {
      return {args};
    },
    template: '<View v-bind="args">Story variant</View>'
  })
};
