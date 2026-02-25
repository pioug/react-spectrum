import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Slider} from '../src';

const meta: Meta<typeof Slider> = {
  title: 'Slider',
  component: Slider,
  args: {
    label: 'Example'
  },
  argTypes: {
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
    components: {Slider},
    setup() {
      return {args};
    },
    template: '<Slider v-bind="args">Example</Slider>'
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
    label: 'Brightness'
  }
};

export const DisabledProp: Story = {
  ...Default,
  args: {
    disabled: true
  }
};
