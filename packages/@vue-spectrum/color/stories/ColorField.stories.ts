import {ColorField} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof ColorField> = {
  title: 'ColorField',
  component: ColorField,
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
    form: {
      control: 'text'
    },
    id: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    name: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {ColorField},
    setup() {
      return {args};
    },
    template: '<ColorField v-bind="args">Example</ColorField>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const Invalid: Story = {
  ...Default,
  args: {
    isInvalid: true
  }
};
