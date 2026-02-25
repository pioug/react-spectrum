import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {NumberField} from '../src';

const meta: Meta<typeof NumberField> = {
  title: 'NumberField',
  component: NumberField,
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
    errorMessage: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    },
    form: {
      control: 'text'
    },
    hideStepper: {
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
      control: 'number'
    },
    min: {
      control: 'number'
    },
    modelValue: {
      control: 'number'
    },
    name: {
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
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {NumberField},
    setup() {
      return {args};
    },
    template: '<NumberField v-bind="args">Example</NumberField>'
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

export const Required: Story = {
  ...Default,
  args: {
    isRequired: true
  }
};
