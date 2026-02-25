import {DateRangePicker} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Date and Time/DateRangePicker/styling',
  component: DateRangePicker,
  args: {
    label: 'Styled range picker'
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
      table: {
        disable: true
      }
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
    components: {DateRangePicker},
    setup() {
      return {args};
    },
    template: '<DateRangePicker v-bind="args"></DateRangePicker>'
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
