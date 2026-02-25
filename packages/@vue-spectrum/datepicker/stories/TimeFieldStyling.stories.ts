import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TimeField} from '../src';

const meta: Meta<typeof TimeField> = {
  title: 'Date and Time/TimeField/styling',
  component: TimeField,
  args: {
    label: 'Styled time field',
    step: 900
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
    components: {TimeField},
    setup() {
      return {args};
    },
    template: '<TimeField v-bind="args"></TimeField>'
  })
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

export const Required: Story = {
  ...Default,
  args: {
    isRequired: true
  }
};
