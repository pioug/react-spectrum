import {Divider} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Divider> = {
  title: 'Divider',
  component: Divider
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Divider},
    setup() {
      return {args};
    },
    template: '<Divider v-bind="args">Example</Divider>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {Divider},
    setup() {
      return {args};
    },
    template: '<Divider v-bind="args">Story variant</Divider>'
  })
};
