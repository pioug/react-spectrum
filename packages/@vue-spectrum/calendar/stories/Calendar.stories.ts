import {Calendar} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Calendar> = {
  title: 'Date and Time/Calendar',
  component: Calendar
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Calendar},
    setup() {
      return {args};
    },
    template: '<Calendar v-bind="args">Example</Calendar>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {Calendar},
    setup() {
      return {args};
    },
    template: '<Calendar v-bind="args">Story variant</Calendar>'
  })
};
