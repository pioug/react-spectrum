import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TagGroup} from '../src';

const meta: Meta<typeof TagGroup> = {
  title: 'TagGroup',
  component: TagGroup
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {TagGroup},
    setup() {
      return {args};
    },
    template: '<TagGroup v-bind="args">Example</TagGroup>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {TagGroup},
    setup() {
      return {args};
    },
    template: '<TagGroup v-bind="args">Story variant</TagGroup>'
  })
};
