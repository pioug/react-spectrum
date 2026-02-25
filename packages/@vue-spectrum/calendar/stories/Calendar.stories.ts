import {Calendar} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Calendar> = {
  title: 'Date and Time/Calendar',
  component: Calendar,
  args: {
    label: 'Example'
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    errorMessage: {
      control: 'text'
    },
    firstDayOfWeek: {
      control: 'select',
      options: [
        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat'
      ]
    },
    label: {
      control: 'text'
    },
    max: {
      control: 'text'
    },
    min: {
      control: 'text'
    },
    modelValue: {
      table: {
        disable: true
      }
    },
    visibleMonths: {
      control: 'number'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Calendar},
    setup() {
      return {args};
    },
    template: '<Calendar v-bind="args"></Calendar>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    disabled: true
  }
};

export const MondayStart: Story = {
  ...Default,
  args: {
    firstDayOfWeek: 'mon'
  }
};

export const TwoMonths: Story = {
  ...Default,
  args: {
    visibleMonths: 2
  }
};
