import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TreeView} from '../src';

const meta: Meta<typeof TreeView> = {
  title: 'TreeView',
  component: TreeView
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {TreeView},
    setup() {
      return {args};
    },
    template: '<TreeView v-bind="args">Example</TreeView>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {TreeView},
    setup() {
      return {args};
    },
    template: '<TreeView v-bind="args">Story variant</TreeView>'
  })
};
