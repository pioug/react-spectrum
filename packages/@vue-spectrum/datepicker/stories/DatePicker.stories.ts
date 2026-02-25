import {DatePicker} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DatePicker> = {
  title: 'Date and Time/DatePicker',
  component: DatePicker
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {DatePicker},
    setup() {
      return {args};
    },
    template: '<DatePicker v-bind="args">Example</DatePicker>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {DatePicker},
    setup() {
      return {args};
    },
    template: '<DatePicker v-bind="args">Story variant</DatePicker>'
  })
};
