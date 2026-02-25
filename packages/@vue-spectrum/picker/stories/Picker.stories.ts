import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Picker} from '../src';

const meta: Meta<typeof Picker> = {
  title: 'Picker',
  component: Picker,
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
    isDisabled: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    },
    isQuiet: {
      control: 'boolean'
    },
    items: {
      table: {
        disable: true
      }
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
    validationState: {
      control: 'text'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Picker},
    setup() {
      return {args};
    },
    template: '<Picker v-bind="args">Example</Picker>'
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
    isInvalid: true
  }
};
