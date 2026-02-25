import {ColorPicker} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorPicker> = {
  title: 'ColorPicker',
  component: ColorPicker,
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
    isDisabled: {
      control: 'boolean'
    },
    isOpen: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ColorPicker},
    setup() {
      return {args};
    },
    template: '<ColorPicker v-bind="args">Example</ColorPicker>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const Open: Story = {
  ...Default,
  args: {
    isOpen: true
  }
};

export const DisabledProp: Story = {
  ...Default,
  args: {
    disabled: true
  }
};
