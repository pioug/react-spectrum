import {DateField} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DateField> = {
  title: 'Date and Time/DateField',
  component: DateField,
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
    isRequired: {
      control: 'boolean'
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
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    readOnly: {
      control: 'boolean'
    },
    required: {
      control: 'boolean'
    },
    step: {
      control: 'number'
    },
    validationState: {
      control: 'select',
      options: [
        'invalid',
        'valid'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {DateField},
    setup() {
      return {args};
    },
    template: '<DateField v-bind="args"></DateField>'
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

export const Invalid: Story = {
  ...Default,
  args: {
    isInvalid: true,
    validationState: 'invalid'
  }
};
