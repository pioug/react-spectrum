import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {RangeCalendar} from '../src';

const meta: Meta = {
  title: 'Date and Time/RangeCalendar/cell'
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    setup() {
      return {};
    },
    components: {RangeCalendar},
    template: '<RangeCalendar />'
  })
};
