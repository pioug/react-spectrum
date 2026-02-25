import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Tooltip} from '../src';

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Tooltip},
    setup() {
      return {args};
    },
    template: '<Tooltip v-bind="args">Example</Tooltip>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {Tooltip},
    setup() {
      return {args};
    },
    template: '<Tooltip v-bind="args">Story variant</Tooltip>'
  })
};
