import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {SearchAutocomplete} from '../src';

const meta: Meta<typeof SearchAutocomplete> = {
  title: 'SearchAutocomplete',
  component: SearchAutocomplete,
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
    options: {
      table: {
        disable: true
      }
    },
    placeholder: {
      control: 'text'
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
    components: {SearchAutocomplete},
    setup() {
      return {args};
    },
    template: '<SearchAutocomplete v-bind="args">Example</SearchAutocomplete>'
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
