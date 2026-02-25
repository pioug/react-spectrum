import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {TooltipTrigger} from '../src';

const meta: Meta<typeof TooltipTrigger> = {
  title: 'TooltipTrigger',
  component: TooltipTrigger,
  args: {
    content: 'Helpful description',
    placement: 'top',
    variant: 'neutral',
    showIcon: false,
    shouldCloseOnPress: true
  },
  argTypes: {
    content: {
      control: 'text'
    },
    isDisabled: {
      control: 'boolean'
    },
    modelValue: {
      control: 'boolean'
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'right',
        'bottom',
        'left'
      ]
    },
    shouldCloseOnPress: {
      control: 'boolean'
    },
    showIcon: {
      control: 'boolean'
    },
    trigger: {
      control: 'text'
    },
    variant: {
      control: 'select',
      options: [
        'neutral',
        'info',
        'positive',
        'negative'
      ]
    }
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: {TooltipTrigger},
    setup() {
      return {args};
    },
    template: `<TooltipTrigger v-bind="args">
  <template #default="{isOpen}">
    <button type="button">{{ isOpen ? 'Tooltip open' : 'Hover or focus me' }}</button>
  </template>
</TooltipTrigger>`
  })
};

export const Disabled: Story = {
  ...Default,
  args: {
    isDisabled: true
  }
};

export const PositiveWithIcon: Story = {
  ...Default,
  args: {
    variant: 'positive',
    showIcon: true
  }
};

export const InitiallyOpen: Story = {
  ...Default,
  args: {
    modelValue: true
  }
};
