import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Radio} from '../src';

const meta: Meta<typeof Radio> = {
  title: 'RadioGroup',
  component: Radio,
  args: {
    label: 'Example'
  },
  argTypes: {
    autoFocus: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    invalid: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isEmphasized: {
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
    value: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Radio},
    setup() {
      return {args};
    },
    template: '<Radio v-bind="args">Example</Radio>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const Emphasized: Story = {
  ...Default,
  args: {
    isEmphasized: true
  }
};

export const Invalid: Story = {
  ...Default,
  args: {
    isInvalid: true
  }
};
