import {Label} from '../src';
import type {Meta, StoryObj} from '@storybook/vue3-vite';

const meta: Meta<typeof Label> = {
  title: 'Label',
  component: Label,
  argTypes: {
    elementType: {
      control: 'text'
    },
    for: {
      control: 'text'
    },
    forId: {
      control: 'text'
    },
    htmlFor: {
      control: 'text'
    },
    includeNecessityIndicatorInAccessibilityName: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    labelAlign: {
      control: 'text'
    },
    labelPosition: {
      control: 'text'
    },
    necessityIndicator: {
      control: 'text'
    },
    required: {
      control: 'boolean'
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {Label},
    setup() {
      return {args};
    },
    template: '<Label v-bind="args">Example</Label>'
  })
};

export const Required: Story = {
  ...Default,
  args: {
    isRequired: true
  }
};

export const AccessibilityIndicator: Story = {
  ...Default,
  args: {
    includeNecessityIndicatorInAccessibilityName: true,
    isRequired: true
  }
};
