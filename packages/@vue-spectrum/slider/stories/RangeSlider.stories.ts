import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {RangeSlider} from '../src';

const meta: Meta<typeof RangeSlider> = {
  title: 'Slider/RangeSlider',
  component: RangeSlider,
  args: {
    label: 'Example'
  },
  argTypes: {
    disabled: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    max: {
      control: 'number'
    },
    min: {
      control: 'number'
    },
    modelValue: {
      table: {
        disable: true
      }
    },
    showValue: {
      control: 'boolean'
    },
    step: {
      control: 'number'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {RangeSlider},
    setup() {
      return {args};
    },
    template: '<RangeSlider v-bind="args">Example</RangeSlider>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const CustomLabel: Story = {
  ...Default,
  args: {
    label: 'Story variant'
  }
};
