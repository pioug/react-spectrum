import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TimeField} from '../src';

const meta: Meta<typeof TimeField> = {
  title: 'Date and Time/TimeField',
  component: TimeField
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {TimeField},
    setup() {
      return {args};
    },
    template: '<TimeField v-bind="args">Example</TimeField>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {TimeField},
    setup() {
      return {args};
    },
    template: '<TimeField v-bind="args">Story variant</TimeField>'
  })
};
