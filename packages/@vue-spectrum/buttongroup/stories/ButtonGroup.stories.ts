import {ButtonGroup} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ButtonGroup> = {
  title: 'ButtonGroup',
  component: ButtonGroup
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ButtonGroup},
    setup() {
      return {args};
    },
    template: '<ButtonGroup v-bind="args">Example</ButtonGroup>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {ButtonGroup},
    setup() {
      return {args};
    },
    template: '<ButtonGroup v-bind="args">Story variant</ButtonGroup>'
  })
};
