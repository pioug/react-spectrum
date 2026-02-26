import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {View} from '../src';

const meta: Meta<typeof View> = {
  title: 'View',
  component: View,
  args: {
    colorVersion: 5,
    backgroundColor: 'blue-400'
  },
  argTypes: {
    backgroundColor: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {View},
    setup() {
      return {args};
    },
    template: '<View v-bind="args" width="single-line-width" height="size-500" element-type="span" />'
  })
};
