import type {Meta, StoryObj} from '@storybook/vue3-vite';
import {Tooltip} from '../src';

const meta: Meta<typeof Tooltip> = {
  title: 'Tooltip',
  component: Tooltip,
  args: {
    isOpen: true,
    placement: 'top',
    variant: 'neutral',
    showIcon: false
  },
  argTypes: {
    ariaLabel: {
      control: 'text'
    },
    ariaLabelledby: {
      control: 'text'
    },
    id: {
      control: 'text'
    },
    isOpen: {
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
    showIcon: {
      control: 'boolean'
    },
    state: {
      table: {
        disable: true
      }
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
    components: {Tooltip},
    setup() {
      return {args};
    },
    template: '<Tooltip v-bind="args">Tooltip content</Tooltip>'
  })
};

export const PositiveWithIcon: Story = {
  ...Default,
  args: {
    variant: 'positive',
    showIcon: true
  }
};

export const NegativeRight: Story = {
  ...Default,
  args: {
    variant: 'negative',
    placement: 'right',
    showIcon: true
  }
};

export const BottomPlacement: Story = {
  ...Default,
  args: {
    placement: 'bottom'
  }
};
