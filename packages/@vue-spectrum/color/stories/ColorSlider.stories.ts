import {ColorSlider} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorSlider> = {
  title: 'ColorSlider',
  component: ColorSlider,
  args: {
    label: 'Example'
  },
  argTypes: {
    channel: {
      control: 'text'
    },
    description: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    id: {
      control: 'text'
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
      control: 'number'
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
    components: {ColorSlider},
    setup() {
      return {args};
    },
    template: '<ColorSlider v-bind="args">Example</ColorSlider>'
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
