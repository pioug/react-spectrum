import {CheckboxGroup} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'CheckboxGroup',
  component: CheckboxGroup,
  args: {
    label: 'Example'
  },
  argTypes: {
    description: {
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
    label: {
      control: 'text'
    },
    modelValue: {
      table: {
        disable: true
      }
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
    components: {CheckboxGroup},
    setup() {
      return {args};
    },
    template: '<CheckboxGroup v-bind="args">Example</CheckboxGroup>'
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

export const InvalidProp: Story = {
  ...Default,
  args: {
    invalid: true
  }
};
