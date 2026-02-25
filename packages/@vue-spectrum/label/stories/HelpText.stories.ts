import {HelpText} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof HelpText> = {
  title: 'HelpText',
  component: HelpText,
  argTypes: {
    description: {
      control: 'text'
    },
    validationState: {
      control: 'select',
      options: ['valid', 'invalid']
    },
    isInvalid: {
      control: 'boolean'
    },
    isDisabled: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {HelpText},
    setup() {
      return {args};
    },
    template: '<HelpText v-bind="args">Example</HelpText>'
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

export const ValidState: Story = {
  ...Default,
  args: {
    validationState: 'valid'
  }
};
