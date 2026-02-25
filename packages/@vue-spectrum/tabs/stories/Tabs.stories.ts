import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Tabs} from '../src';

const meta: Meta<typeof Tabs> = {
  title: 'Tabs',
  component: Tabs
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Tabs},
    setup() {
      return {args};
    },
    template: '<Tabs v-bind="args">Example</Tabs>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {Tabs},
    setup() {
      return {args};
    },
    template: '<Tabs v-bind="args">Story variant</Tabs>'
  })
};
