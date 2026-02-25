import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {RangeCalendar} from '../src';

const meta: Meta<typeof RangeCalendar> = {
  title: 'Date and Time/RangeCalendar',
  component: RangeCalendar
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {RangeCalendar},
    setup() {
      return {args};
    },
    template: '<RangeCalendar v-bind="args">Example</RangeCalendar>'
  })
};

export const AlternateContent: Story = {
  render: (args) => ({
    components: {RangeCalendar},
    setup() {
      return {args};
    },
    template: '<RangeCalendar v-bind="args">Story variant</RangeCalendar>'
  })
};
