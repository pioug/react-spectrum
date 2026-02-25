import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {SearchField} from '../src';

const meta: Meta<typeof SearchField> = {
  title: 'SearchField',
  component: SearchField,
  args: {
    label: 'Example'
  },
  argTypes: {
    autoFocus: {
      control: 'boolean'
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
    invalid: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    isReadOnly: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    },
    modelValue: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    required: {
      control: 'boolean'
    },
    validationState: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {SearchField},
    setup() {
      return {args};
    },
    template: '<SearchField v-bind="args">Example</SearchField>'
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const Quiet: Story = {
  ...Default,
  args: {
    isQuiet: true
  }
};

export const ReadOnly: Story = {
  ...Default,
  args: {
    isReadOnly: true
  }
};
